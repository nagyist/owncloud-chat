angular.module('chat').factory('xmpp', ['convs', 'contacts', 'initvar', function(convs, contacts, initvar) {
	$XMPP = {
		on : {
			chatMessage : function(msg, from){
				var convId = from.substring(0, from.indexOf('/'));
				convs.addChatMsg(
					convId,
					contacts.contacts[1],
					msg,
					Time.now(),
					'och'
				);
			},
			connected : function(){

			},
			disconnected : function(){

			}
		},
		jid: initvar.backends.xmpp.config.jid,
		password: initvar.backends.xmpp.config.password
	};
	var onMessage = function(msg){
		var to = msg.getAttribute('to');
		var from = msg.getAttribute('from');
		var type = msg.getAttribute('type');
		var elems = msg.getElementsByTagName('body');

		if (type == "chat" && elems.length > 0) {
			var body = elems[0];
			$XMPP.on.chatMessage(Strophe.getText(body), from);
		}
		return true;
	};

	var onConnect = function(status) {
		if (status == Strophe.Status.CONNECTING) {
			log('Strophe is connecting.');
		} else if (status == Strophe.Status.CONNFAIL) {
			log('Strophe failed to connect.');
			initvar.backends.xmpp.connected = false;
		} else if (status == Strophe.Status.DISCONNECTING) {
			log('Strophe is disconnecting.');
			initvar.backends.xmpp.connected = false;
		} else if (status == Strophe.Status.DISCONNECTED) {
			log('Strophe is disconnected.');
			initvar.backends.xmpp.connected = false;
		} else if (status == Strophe.Status.CONNECTED) {
			log('Strophe is connected.');
			log('ECHOBOT: Send a message to ' + connection.jid +
			' to talk to me.');
			initvar.backends.xmpp.connected = true;
			connection.addHandler(onMessage, null, 'message', null, null, null);
			connection.send($pres().tree());
		}
	};

	var log = function(msg){
		console.log(msg);
	}

	var connection = null;

	return {
		BOSH_SERVICE : '/http-bind/',
		init : function(){
			// Create connection
			connection = new Strophe.Connection(this.BOSH_SERVICE);
			connection.connect($XMPP.jid, $XMPP.password, onConnect);
		},
		quit : function(){
		},
		sendChatMsg : function(convId, msg){
			var reply = $msg({to: convId, from: this.jid , type: 'chat'}).c('body', null,msg
			);
			connection.send(reply.tree());
		},
		invite : function(convId, userToInvite, groupConv, callback){
		},
		newConv : function(userToInvite, success){
		},
		attachFile : function(convId, paths, user){
		},
		removeFile : function(convId, path){
		},
		configChanged : function(){
			$XMPP.jid = initvar.backends.xmpp.config.jid;
			$XMPP.password = initvar.backends.xmpp.config.password;
			connection.disconnect();
			this.init();
		}
	};
}]);