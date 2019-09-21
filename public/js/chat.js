var socket = io();//initiating request
function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});
socket.on('chatHistory',function(data){
  //console.log("REACHED CHAT HISTORY")
  var template;
  //console.log(data)
  data.forEach(function (arrayItem) {
    if(arrayItem.url)
    { template = jQuery('#message-template1').html();
      var html = Mustache.render(template, {
        from: arrayItem.from,
        image:arrayItem.image,
        url:arrayItem.url,
        createdAt:arrayItem.createdAt
        
        // createdAt: formattedTime
       })
    }
    if(arrayItem.file)
    {
       template = jQuery('#message-template2').html();
      var html = Mustache.render(template, {
        from: arrayItem.from,
        image:arrayItem.image,
        file:arrayItem.file,
        fileName:arrayItem.fileName,
        createdAt:arrayItem.createdAt
        
        // createdAt: formattedTime
       })
    }
    if(arrayItem.text){
      template = jQuery('#message-template').html();
      var html = Mustache.render(template, {
        from: arrayItem.from,
        image:arrayItem.image,
        text:arrayItem.text,
        createdAt:arrayItem.createdAt
        
        // createdAt: formattedTime
       })
    }
    //console.log(arrayItem.from)
    
    jQuery('#messages').append(html);
    scrollToBottom();
 })
  
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
 console.log(message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    image:message.image,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    image:message.image,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newFileMessage', function (message) {
 console.log(message)
  //var newfile=`${document.write(message.file)}.txt`
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#file-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
   //file: message.file,
   file:message.file,
   image:message.image,
   fileName:message.fileName,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});


jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});

$('input[type="file"]').change(function(e){
  
 // var fileName = document.forms["form"]["add-file"].files[0]
  //console.log('The file "' + fileName +  '" has been selected.');
  //console.log(file)

  //console.log("add file reached")
 // $('#add-file').on('change', function(e){
    var data = e.originalEvent.target.files[0];
    console.log("reached")
    readThenSendFile(data);      
  });
  
  function readThenSendFile(data){
   console.log(data)
    var reader = new FileReader();
    reader.onload = function(evt){
        var msg ={};
       // msg.username = username;
        msg.file = evt.target.result;
        msg.fileName = data.name;
        socket.emit('base64 file', msg);
    };
    reader.readAsDataURL(data);
  }

 // locationButton.attr('disabled', 'disabled').text('Sending location...');
   // socket.emit('createLocationMessage', {
     // latitude: position.coords.latitude,
      //longitude: position.coords.longitude
    //});