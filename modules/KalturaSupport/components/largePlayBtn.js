( function( mw, $ ) {"use strict";

	// Todo: support "visible" attribute to show/hide button on player state change
	var pluginName = 'largePlayBtn';
		// Check if the plugin is enabled:
	mw.addKalturaPlugin( pluginName, function( embedPlayer, callback ){

		// iPhone in WebKitPlaysInline mode does not support clickable overlays as of iOS 5.0
		if( mw.getConfig( 'EmbedPlayer.WebKitPlaysInline') && mw.isIphone() ) {
			callback();
			return ;
		}

		new largePlayBtn( embedPlayer, pluginName );
		// Continue player build-out
		callback();
	});

	var largePlayBtn = mw.KBaseComponent.extend({
		defaultConfig: {
			'parent': 'videoHolder',
			'order': 1
		},
		setup: function() {
			this.addBindings();
		},
		/**
		 * Checks if the play button should stay on screen during playback,
		 * cases where a native player is dipalyed such as iPhone.
		 */
		isPersistantPlayBtn: function(){
			return mw.isAndroid2() || this.getPlayer().isLinkPlayer || 
					( mw.isIphone() && mw.getConfig( 'EmbedPlayer.iPhoneShowHTMLPlayScreen' ) );
		},
		/**
		 * Checks if a large play button should be displayed on the
		 * otherwise native player
		 */
		useLargePlayBtn: function(){
			if( this.isPersistantPlayBtn() ){
				return true;
			}
			// If we are using native controls return false:
			return !this.getPlayer().useNativePlayerControls();
		},
		addBindings: function() {
			var _this = this;
			this.bind('showInlineDownloadLink', function(e, linkUrl){
				_this.getComponent().attr({
					'href': linkUrl,
					'target': '_blank'
				});
			});
			this.bind('onChangeMediaDone', function(){
				_this.showButton();
			});
			this.bind('playerReady', function() {
				_this.showButton();
			});
			this.bind('playing', function() {
				_this.hideButton();
			});
			this.bind('onpause', function() {
				_this.showButton();
			});
			this.bind('onEndedDone', function(){
				_this.showButton();
			});
		},
		showButton: function(){
			if( this.useLargePlayBtn() ) {
				this.getComponent().show();
			}
		},
		hideButton: function(){
			if( !this.isPersistantPlayBtn() ) {
				this.getComponent().hide();
			}
		},
		clickButton: function( e ){
			if( this.getPlayer().isLinkPlayer ) {
				this.getPlayer().triggerHelper( 'firstPlay' ); // To send stats event for play
				this.getPlayer().triggerHelper( 'playing' );
			} else {
				e.preventDefault();
				this.getPlayer().sendNotification( 'doPlay' );
			}
		},
		getComponent: function() {
			var _this = this;
			if( !this.$el ) {
				this.$el = $( '<a />' )
							.attr( {
								'href' : '#',
								'title' : gM( 'mwe-embedplayer-play_clip' ),
								'class'	: "large-play-btn icon-play-2"
							} )
							.hide()
							// Add play hook:
							.click( function(e) {
								_this.clickButton(e);
							} );		
			}
			return this.$el;
		}
	});

} )( window.mw, window.jQuery );