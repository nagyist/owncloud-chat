(function ($) {
    $.fn.applyContactAvatar = function(addressbookBackend, addressBookId, id, displayname, size) {
        var $div = this;
        $div.height(size);
        $div.width(size);

        // First generate an id of this contact which is used in the cache
        var cacheId = id;
		// Next check if the cacheId occurs in the cache
		var value = Cache.get(cacheId)
		if(value !== undefined){
			console.log(value);
            if (value.noAvatar == true) {
                $div.imageplaceholder(displayname);
            } else {
                $div.show();
				$div.html('<img width="' + size + '" height="' + size + '" src="'+ value.base64 +'">');
			}
        } else {
			var url = OC.generateUrl(
				'/avatar/{user}/{size}?requesttoken={requesttoken}',
				{user: id, size: size * window.devicePixelRatio, requesttoken: oc_requesttoken});
			$.get(url, function(result) {
				if (typeof(result) === 'object') {
                    Cache.set(cacheId, {"noAvatar" : true}, 86400);
                    $div.imageplaceholder(displayname);
                } else {
					Cache.set(cacheId, {"noAvatar" : false, "base64" : url}, 86400);
                    $div.show();
					$div.html('<img width="' + size + '" height="' + size + '" src="'+url+'">');
				}
            });
        }
    };
}(jQuery));
