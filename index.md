---
layout: default
title: dscltable.js - 簡易jQueryテーブル
---

dscltable.jsは最低限の機能を持つ簡易的なjQueryテーブルです。  
dscltable.js is a limited-functional table for jQuery.

Japanese  / [English](index_en.html)


Features
-----

業務系Webアプリケーションの開発では、表を表現したいシーンがよくあります。
またスマートフォンで業務系Webアプリケーションを使うシーンも増えてきました。
モバイルサイトやPCサイトに限定せず、軽量で容易に扱えるテーブルが求められています。
dscltable.jsは、業務系Webアプリケーションでの利用を想定した以下の機能を持つ簡易的なテーブルです。


*   列の縦表示切替（横幅の制限されるスマートフォンでの利用を想定）
*   ajaxによるサーバ連携
*   簡易ページャ
*   行選択


※dsclgridのdsclはアカウント名(dosancole)の略字をあてています。読めなくてごめんなさい^^;

Sample View
-----
ajaxによるサーバ取得、簡易ページャ、行選択の例です。
PCで見ると通常の一覧、スマートフォンで見ると列を縦表示に切り替えた表になります。
（サーバが出力するデータは静的なもので、ページャやソートは動作しません^^;）

<script type="text/javascript">
		$(function(){
			var ua = navigator.userAgent.toLowerCase();
			var isSP = (ua.indexOf('iphone') > -1 || (ua.indexOf('android') > -1 && ua.indexOf('mobile') > -1));
		    $('#sampleview').dscltable({
		    	method: 'GET',
		        url: 'sampleview.json',
		        selectable : true,
				selectableRadio : true,
				selectableRadioTH : "",
				tableLoadingImage : 'stylesheets/indicator.gif',
		        tableClass : 'table',
		        pager: true,
       	        pagerLoadingImage : 'stylesheets/indicator.gif',
		        pagerClass : 'pager',
		        pagerPrevClass : "enabled",
		        pagerNextClass : "enabled",
		        pagerPrevDisableClass : "disabled",
		        pagerNextDisableClass : "disabled",
		        vertical : isSP,
		        verticalStart : 2,
				verticalLength : 4,
				verticalTH : "contents",
		        onReady : function(){
				    $('#sampleview').dscltableLoad();
		        },
		        model : [
		            {display: 'user name', tdClass:'user' },
		            {display: 'id', tdClass:'data' },
		            {display: 'address',    tdClass:'data' },
		            {display: 'age',    tdClass:'data' },
		            {display: 'comment',    tdClass:'data' }
		        ]
		    });
		});
</script>
<div id="sampleview"></div>


Change Log
-----

*  v1.0 2013.1
    *  first public version.

Required
-----

*  IE9, FF, Chrome, Safari(iPhone)
*  jquery-1.8.x（確認したverを記載）

※jqueryベースのため、大抵のブラウザで稼働します。


License
-----
Copyright &copy; 2013 [takuya Dosancole].
Dual licensed under the [MIT license][MIT] or [GPL Verion 2 license][GPL].
dsclgrid.js includes [jQuery]. please check each license.

[MIT]: http://www.opensource.org/licenses/mit-license.php
[GPL]: http://www.gnu.org/licenses/gpl.html
[jQuery]: http://jquery.org/
[takuya Dosancole]: https://github.com/dosancole
