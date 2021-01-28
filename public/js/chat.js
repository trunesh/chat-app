const socket=io()

//Elements $singn... just for naming convnetion
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


const messageTemplate =document.querySelector('#message-template').innerHTML // we want inner HTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    // new msg elem // last element child.. last inserted msg
    const $newMessage = $messages.lastElementChild


    //height of new messages
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight= $newMessage.offsetHeight + newMessageMargin


    const visibleHeight = $messages.offsetHeight
    
    //Height of message container
    const containerHeight = $messages.scrollHeight

    //how far i scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message',(message)=>{
   console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    }) // pass objects from 2nd argument.. .message name match with the index.html {{message}}
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('locationMessage',(loc)=>{
    const htm = Mustache.render(urlTemplate,{
        username : loc.username,
        userlocation:loc.url,
        createdAt:moment(loc.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend',htm)
    autoscroll()
    //console.log(url)
})


socket.on('roomData',({room,users})=>{
    
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    
    // you can also do this that was insertadjacent here we just want to display.. not insert multiple 
    document.querySelector('#sidebar').innerHTML = html 
})

$messageForm.addEventListener('submit',(e)=>{
    //disable
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled') //to disable the element

    //const message =document.querySelector('input').value
    //e.target means access to the form
    const message = e.target.elements.message.value
    // socket.emit('sendMessage',message) we can send as many as agrugments
    socket.emit('sendMessage',message,(err)=>{
    
        $messageFormButton.removeAttribute('disabled') //enable element

        $messageFormInput.value=''
        $messageFormInput.focus()


        if(err){
            return console.log(err)
        }
        console.log('Message delivered Successfully!')
        
    })
})


$sendLocationButton.addEventListener('click',()=>{
    
    if(!navigator.geolocation){
        return alert('Geo location is not supported ')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const obj={
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        //console.log(obj)
        socket.emit('send-location',obj,()=>{
            console.log('Location shared')
            $sendLocationButton.removeAttribute('disabled')
        })

    })
})


socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})