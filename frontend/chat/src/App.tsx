import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";

function App() {

  const [message,setmessages] = useState<{username?:string,message:string}[]>([]);
  const [input,setinput] = useState("");
  const [roomid,setroomid] = useState("");
  const [activeroom,setactiveroom] = useState("");   //here we are storing id of a room
  const [connected,setconnected] = useState(false);
  const [membercount,setmembercount] = useState(0);
  const [members,setmembers] = useState<string[]>([]);

  const location = useLocation();
  const username = location.state?.username;

    const wsref = useRef<WebSocket | null>(null);

    useEffect(() => {
    return () => {
      wsref.current?.close();
    };
  }, []);


  if (location.pathname === "/") {
  return <Home />;
}


  //joining room
  function Joinroom(id:string){
    const room = id.trim();
    if(!room || !username.trim()) return;

    //close any previous connect
    wsref.current?.close();
    wsref.current =null;

    setmessages([]);
    setactiveroom(room);
    setconnected(false);

    const ws = new WebSocket("ws://localhost:8080");
    wsref.current = ws;

    ws.onopen = () =>{
        ws.send(
          JSON.stringify({
            type:"join",
            payload:{
              roomid:room,
              username:username
            }
          })
          )
    }

    ws.onmessage = (event) =>{
      const parsed_message = JSON.parse(event.data as string);

      if(parsed_message.type === "room-count"){
        setmembercount(parsed_message.payload);
        return;
      }
      
      if(parsed_message.type == "join"){
        // setmembers((prev) => [...prev,parsed_message.payload.username]);
        setconnected(true);
        return;
      }

      if(parsed_message.type == "chat"){
        setmessages((prev)=> [
          ...prev,
          {
            message:parsed_message.payload.message,
            username:parsed_message.payload.username
          }]);
      }

      if(parsed_message.type == "room-members"){
        setmembers(parsed_message.payload);
      }
      
    }

    ws.onclose = () =>{
      if(wsref.current === ws){
        setconnected(false);
        wsref.current = null;
      }
    }

    ws.onerror = () =>{
      setconnected(false);
    }


  }

  function Createroom(){
    const id = crypto.randomUUID().slice(0, 8);
    setroomid(id);
    Joinroom(id);
  }

  function Sendmessage(){
    const ws = wsref.current;

    if(!input.trim()){
      return;
    }
    if(!ws || ws.readyState !== WebSocket.OPEN){
        console.log("websocket is not connectd");
        return;
       }
      ws?.send(
        JSON.stringify({
          type : "chat",
          payload:{
            message:input.trim(),
          }
        })
      )
   
    setinput("");
    
  }

   
  
  
  return (
    <div className="flex">
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>




    
      
      <div className="w-1/2 bg-gray-500">
      <div className="p-4 bg-black text-white rounded-lg border-2 border-blue-500">ChatSpace</div>
          <div className="bg-black rounded-lg border-2 border-blue-500 p-4 text-white">your room id:{roomid}</div>
          <div className="bg-black rounded-lg border-2 border-blue-500 p-4 text-white">Room members : {membercount}</div>
          <div>
          {/* <h3 className="">Members</h3>
          <div>{members}</div> */}
          
          <div className="bg-black rounded-lg border-2 border-blue-500 p-4 text-white">
            <h3>Members</h3>
             {members.map((username) => (
                <div className="rounded-lg border-2 border-blue-300 p-4" key={username}>{username}</div>
              ))}
          </div>

      </div>
      </div>
      
   <div className=" bg-black text-white  flex-col w-1/2 rounded-lg border-2 border-blue-500 ">
      {/* Room controls */}
      <div className="flex gap-2 p-4">
        <button
          onClick={Createroom}
          className="bg-purple-600 rounded p-3"
        >
          Create Room
        </button>

        <input
          value={roomid}
          onChange={(e) => setroomid(e.target.value)}
          placeholder="Enter room ID"
          className="flex-1 min-w-0 rounded p-3 text-black bg-blue-100 rounded-lg border-2 border-blue-500"
        />

        <button
          onClick={() => Joinroom(roomid)}
          className="bg-blue-600 rounded p-3"
        >
          Join
        </button>
      </div>

      {/* Room information */}
      {activeroom && (
        <div className="px-4 py-2 flex gap-3 items-center">
          <span>Room: {activeroom}</span>

          <button
            onClick={() =>
              navigator.clipboard.writeText(activeroom)
            }
            className="bg-gray-700 rounded px-3 py-1"
          >
            Copy ID
          </button>

          <span className="text-sm">
            {connected ? "Connected" : "Connecting..."}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {message.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="inline-block bg-white text-black rounded p-3 rounded-lg border-2 border-blue-500">
              <strong>{message.username ?? "Unknown"}:</strong>{" "}
            {message.message}
            </span>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="fixed bottom-0 w-[50%] right-0 flex bg-white  rounded-lg border-2 border-blue-500 ">
        <input
          value={input}
          onChange={(e) => setinput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") Sendmessage();
          }}
          placeholder="Type a message..."
          className="flex-1 min-w-0 p-3 text-black"
        />

        <button
          onClick={Sendmessage}
          className="bg-purple-600 p-4 text-white rounded-lg border-2 border-blue-500"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  )
}

export default App
