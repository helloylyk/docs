/**
 * 根据参数名获取URL参数值。
 * @param {String} param
 */
function getUrlParameter(param){
	var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null && r.length > 2) 
		return unescape(r[2]); 
	else
		return null;
};

/**
 * 加载文档。
 * @param {String} view
 * @param {Function} callback
 */
function loadDocument(view, callback){
	/**
	 * 生成锚点
	 */
	(function generateAnchor() {
		var titles = $('.ui.accordion>.title[data-id]');
		for (var i = 1; i <= titles.length; i++) {
			var self = $(titles[i - 1]);
			var tagId = self.attr('data-id');
			var items = self.next('.content').find('.ui.list > .item');
			hhh[i]=(self[0].id);
			for (var j = 1; j <= items.length; j++) {
				items[j - 1].href = '#' + tagId + '_' + j;
			}
		}
	})();
	
	/**
	 * 切换视图
	 */
	(function changeView() {
		var content = $('#content');
		$('.ui.accordion').accordion().children('.title').click(function() {
			var self = $(this);
			window.location.hash = '#' + self.attr('data-id');
		});
		
		window.onhashchange = function changeContent(e) {
			var oldHash = e.oldURL.split('#')[1] || '';
			var newHash = e.newURL.split('#')[1] || '';
			if (oldHash.split('_')[0] != newHash.split('_')[0]){
				loadView(newHash.split('_')[0], newHash.split('_')[1]);
			}
		};
		
		var hash = window.location.hash.split('_');
		if (hash.length > 0){
			loadView(hash[0].substr(1), hash[1]);
		} else {
			loadView();
		}
	})();

	function loadView(viewId, hashId){
		var hash = '#' + viewId + '_' + (hashId || 1);
		var item = $('.ui.accordion>.content>.list>.item[href="' + hash + '"]');
		if (item.length > 0) {
			$('.ui.accordion>.content.active,.ui.accordion>.title.active').removeClass('active');
			
			var c = item.parents('.content');
			var t = c.prev('.title');
			c.addClass('active').find('.ui.list').removeClass('hidden').addClass('visible');
			t.addClass('active');
			
			var content = $('#content');
			content.html('').addClass('loading').load('views/' + view + '/' + viewId + "-"+hhh[viewId]+'.html', function() {
				// 代码着色
				$('pre code').each(function(i, block) {
					hljs.highlightBlock(block);
				});
				// 生成标题
				var headers = content.children('h3');
				for (var i = 1; i <= headers.length; i ++){
					$(headers[i - 1]).attr('id', viewId + '_' + i);
					//$(headers[i - 1]).html($(c.children('.list').children('.item')[i - 1]).html());
				}
				// 快速定位
				if ($(hash).length > 0) {
					$('body,html').animate({
						scrollTop: isNaN(hashId) ? 0 : $(hash).offset().top
					}, 100);
				}
				// 结束加载
				content.removeClass('loading');
				callback && callback();
			});
		} else {
			var title = $('.ui.accordion > .title[data-id="' + viewId + '"]');
			if (title.length == 0){
				title = $('.ui.accordion > .title:first-child');
			}
			if (!title.hasClass('active')){
				title.click();
			}
		}
	}
};
