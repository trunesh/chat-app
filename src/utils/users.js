const users = []

//addUser , removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room}) =>{

 


    //validate
    if(!username || !room){
        return{
            error : 'Username and name are required'
        }
    }

       //clean data
       username  = username.trim().toLowerCase() 
       room = room.trim().toLowerCase()

    //check for exising user
    const existinguser= users.find((user)=>{
        return user.room===room && user.username === username
    })

    if(existinguser){
        return{
            error:'Username is in use!'
        }
    }
    
    //store 
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
        const index = users.findIndex((user)=> user.id===id)
        if(index!==-1){
            return users.splice(index,1)[0] // here we remove index item , only 1 .. the method returns an array... so we are returning [0] position returned elemeent
        }
}

const getUser = (id)=>{
    return users.find((user)=> user.id ===id)
}

const getUsersInRoom = (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
// const getUsersInRoom= (room)=>{
//     const roomUsers=[]

//     users.forEach((user)=>{
//         if(user.room===room){
//             roomUsers.push(user.username)
//         }
//     })
//     return roomUsers
// }

// addUser({
//     id:24,
//     username:'     BATMan',
//     room:'     Gotham'
// })

// //console.log(users)

// const res = addUser({
//     id:22,
//     username:'ba1tman',
//     room:'gotham'
// })

// addUser({
//     id:32,
//     username:'ANdr',
//     room:'black'
// })

// const g= getUser(32)
// console.log(g)


// const my=getUsersInRoom('gotham1')

// console.log('USERS IN GOTHAM')
// console.log(my)