/**
 * Created by Tyler on 6/11/2016.
 */

$(function(){
    var socket = io(),
        nickname = "";
    //username view
    $('input[name="nickname"]').focus();
    $('#nicknameContainer').on('keyup', 'input[name="nickname"]', function(event){
        event.preventDefault();
        toggleSubmitNickname($(this));
        var code = event.keyCode || event.which;

        if($(this).val() !== "" && code === 13)
        {
          nickname = $('input[name="nickname"]').val();
          socket.emit('userJoined', nickname);
        }
    });

    $('body').on('click', 'button[name="clear"]', function(event){
        event.preventDefault();
        $('input[name="nickname"]').val('');
        toggleSubmitNickname($('input[name="nickname"]'));
    });

    $('body').on('click', 'button[name="submitNickname"]', function(event){
        event.preventDefault();
        nickname = $('input[name="nickname"]').val();
        socket.emit('userJoined', nickname);
    });

    $('body').on('click', '#submit', function(event){
        event.preventDefault();
        sendMessage($('#chatInput'));
    });


    socket.on('chatMessage', function(message){
        appendMessage(message);
    });

    socket.on('showChat', function(messages){
        $('.container').replaceWith('<div class="container"> <h1 class="text-center hidden-xs hidden-sm">My Chat Application</h1><div id="textContainer"></div><div> <input id="chatInput" type="text" placeholder="Type here..."/> <button id="submit" class="btn btn-lg btn-block btn-success">Send Message</button></div></div>');
        $('#chatInput').focus().on('keyup', function(event){
            event.preventDefault();
            var code = event.keyCode || event.which;

            if(code == 13)
            {
                sendMessage($('#chatInput'), nickname);
            }
        });;
        if(messages.length > 0){
          var message = "";
          for(var i=0; i<messages.length; i++)
          {
            message = messages[i];
            appendMessage(message.nickname + ' : ' + message.message);
          }
        }
    });

  function appendMessage(message)
  {
        $('#textContainer').append('<div>'+message+'</div>').scrollTop($("#textContainer")[0].scrollHeight);
  }

  function toggleSubmitNickname(object)
  {
        object.val() !== "" ? $('button[name="submitNickname"]').removeAttr('disabled') : $('button[name="submitNickname"]').prop('disabled', 'disabled');
  }

  function sendMessage(object, nickname){
      message = object.val();
      if($.trim(message) !== ""){
        socket.emit('message', message);
        appendMessage(nickname + ' : ' + message);
        object.val('');
      }
      else{
        alert('Please enter text in the text field.');
      }
  }

});
