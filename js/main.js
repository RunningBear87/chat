/**
 * Created by Tyler on 6/11/2016.
 */

$(function(){
    var socket = io();


    //username view
    $('body').on('keyup', 'input[name="nickname"]', function(event){
        event.preventDefault();
        toggleSubmitNickname($(this));
    });

    $('body').on('click', 'button[name="clear"]', function(event){
        event.preventDefault();
        $('input[name="nickname"]').val('');
        toggleSubmitNickname($('input[name="nickname"]'));
    });

    $('body').on('click', 'button[name="submitNickname"]', function(event){
        event.preventDefault();
        socket.emit('userJoined', $('input[name="nickname"]').val());
    });

    $('body').on('click', '#submit', function(event){
        event.preventDefault();
        sendMessage($('#chatInput'));
    });

    $('body').on('keyup', function(event){
        event.preventDefault();
        var code = event.keyCode || event.which;

        if(code == 13)
        {
            sendMessage($('#chatInput'));
        }
    });

    socket.on('chatMessage', function(message){
        $('#textContainer').append('<div>'+message+'</div>');
    });
    
    socket.on('showChat', function(name){
        $('.container').replaceWith('<div class="container"> <h1 class="text-center">My Chat Application</h1><div id="textContainer"></div><div> <input id="chatInput" type="text" placeholder="Type here..."/> <button id="submit" class="btn btn-lg btn-block btn-success">Send Message</button></div></div>')
    });

    var toggleSubmitNickname = function(object){
        object.val() !== "" ? $('button[name="submitNickname"]').removeAttr('disabled') : $('button[name="submitNickname"]').prop('disabled', 'disabled');
    };
    
    var sendMessage = function(object){
        if(object.val() !== ""){
            socket.emit('message', object.val());
            object.val('');
        }
        else{
            alert('Please enter text in the text field.');
        }
    }
});