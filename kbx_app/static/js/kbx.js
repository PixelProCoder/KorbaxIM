var kbxClient = {

}

var kbxServer = {
    websocket_url: "ws://127.0.0.1:5443/ws",
    connection: null,
    log: function(msg) {
        console.log(msg);
    },
    jid: null,
    sid: null,
    rid: null
}

window.onload = function(){
    // Initialize server connection
    if(kbxServer.websocket_url != null)
    {
        kbxServer.connection = new Strophe.Connection(kbxServer.websocket_url);
        kbxServer.connection = new Strophe.Connection(kbxServer.websocket_url);
        kbxServer.connection.connect(
            "steve@localhost",
            "steve",
            onConnect
        )
    }
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
        kbxServer.log('Connecting...');
    } else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
        kbxServer.log('Failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
        kbxServer.log('Disconnecting...');
    } else if (status == Strophe.Status.DISCONNECTED) {
        kbxServer.log('Disconnected.');
    } else if (status == Strophe.Status.CONNECTED || status == Strophe.Status.ATTACHED) {
        kbxServer.log('Connected.');
        kbxServer.connection.send($pres());
        kbxServer.connection.addHandler(onMessage, null, 'message', null, null, null);
        kbxServer.connection.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
        //connection.addHandler(onPresence, null, "presence");
        loginSuccess();

    }
}

function loginSuccess() {
    getRoster();
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
  
    if (type == "chat" && elems.length > 0) {
      var body = elems[0];
      kbxServer.log('CHAT: I got a message from ' + from + ': ' + Strophe.getText(body));
    }
    return true;
  }

  function onSubscriptionRequest(stanza) {
    if(stanza.getAttribute('type') == 'subscribe') {
      var from = $(stanza).attr('from');
      kbxServer.log('onSubscriptionRequest: from=' + from);
      kbxServer.connection.send($pres({
        'to': from,
        'type': 'subscribed'
      }));
    }
    return true;
  }

  function getRoster() {
    kbxServer.log('getRoster');
    var iq = $iq({
      type: 'get'
    }).c('query', {
      xmlns: 'jabber:iq:roster'
    });
    kbxServer.connection.sendIQ(iq, rosterCallback);
  }

  function rosterCallback(iq) {
    var rosterDiv = document.getElementById('contacts');
    var fragment = document.createDocumentFragment();

    /**
     * Dynamically create HTML elements using JavaScript.
     */
    // <a></a> Element
    var hrefEl = document.createElement('a');
    hrefEl.href = "#";
    hrefEl.className = "filterMembers all offline contact";
    hrefEl.setAttribute('data-toggle', 'list');

    // <img></img> Element
    var imgEl = document.createElement('img');
    imgEl.className = "avatar-md";
    imgEl.src = "dist/img/avatars/avatar-female-1.jpg";
    imgEl.setAttribute('data-toggle', "tooltip");
    imgEl.setAttribute('data-placement', "top");
    imgEl.alt = "avatar";

    // <div></div> Elements
    var divEl1 = document.createElement('div');
    divEl1.className = "status";
    var divEl2 = document.createElement('div');
    divEl2.className = "data";
    var divEl3 = document.createElement('div');
    divEl3.className = "person-add";

    // <i></i> Elements
    var iEl1 = document.createElement('i');
    iEl1.className = "material-icons offline";
    var iEl2 = document.createElement('i');
    iEl2.className = "material-icons";
    iEl2.innerText = "person";

    // <h5></h5> Element
    var h5El = document.createElement('h5');

    // <p></p> Element
    var pEl = document.createElement('p');

    kbxServer.log(iq);
    $(iq).find('item').each(function() {
      //var jid = $(this).attr('jid');

      imgEl.title = $(this).attr('name');
      iEl1.innerText = "fiber_manual_record";
      divEl1.appendChild(iEl1)

      h5El.innerText = $(this).attr('name');
      pEl.innerText = "Sofia, Bulgaria";
      divEl2.appendChild(h5El);
      divEl2.appendChild(pEl);

      divEl3.appendChild(iEl2);

      hrefEl.appendChild(imgEl);
      hrefEl.appendChild(divEl1);
      hrefEl.appendChild(divEl2);
      hrefEl.appendChild(divEl3);
      
      fragment.appendChild(hrefEl)
    });
    rosterDiv.appendChild(fragment);
  }
