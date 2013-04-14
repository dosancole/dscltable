---
layout: default
title: dscltable.js - 簡易jQueryテーブル
---

Japanese  / English(under construction)


Features
-----

業務系Webアプリケーションの開発では、表を表現したいシーンがよくあります。
またスマートフォンで業務系Webアプリケーションを使うシーンも増えてきました。
dscltable.jsは、モバイルサイトやPCサイトに限定せず軽量で容易に扱える
以下の機能を持つjqueryテーブルです。


*   列の縦表示切替（横幅の制限されるスマートフォンでの利用を想定）
*   ajaxによるサーバ連携
*   簡易ページャ
*   行選択


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

Quick Start
-----

ここでは一番シンプルなテーブルを表示してみます。
事前に[ダウンロード](https://github.com/dosancole/dscltable/zipball/master "ダウンロード")したファイルを展開、配置しておいてください。
参照可能な位置にhtmlファイルとJSONのデータファイルを作成します。


まずは以下のhtmlファイルを用意してください。
※cssとjavascriptのURL、後で用意するdata.jsonのURLは、配置場所によって修正してください。

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="../../web/js/jquery-1.8.1.min.js"></script>
	    <script type="text/javascript" src="../../web/js/dscltable.js" ></script>
		<title>dscltable.js sample 000</title>
		<script type="text/javascript">
			$(function(){
			    $('#table').dscltable({
			        url: 'data.json',
			        tableClass : 'borderd',
			        onReady : function(){
					    $('#table').dscltableLoad();
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
	    <style type="text/css">
			body { font: 14px Helvetica,arial,freesans,clean,sans-serif !important; }
			table.borderd { border: 1px solid #aaa;border-spacing: 0px 0px !important;border-collapse: collapse !important;}
			table.borderd th { border: 1px solid #aaa; padding: 5px 10px 5px 10px;}
			table.borderd td { border: 1px solid #aaa; padding: 5px 10px 5px 10px;}
			th { color: #fff; background-color: #666;}
			td.user { text-align: left; color: red; }
			td.data { text-align: center; }
			tr.even { background-color: #eee; }
	    </style>
	</head>
	<body>
		<div id="table"></div>
	</body>
	</html>

次にサーバ相当のJSONを返却する data.json を用意します（簡単のために固定のものです）。

	{
		"offset" : 0,
		"page"   : 1,
		"rows"   : [
			{ "cell" : ["sato",     "0001","tokyo Japan",    "20", "comment."] },
			{ "cell" : ["suzuki",   "0002","hokkaido Japan", "45", "comment."] },
			{ "cell" : ["takahashi","0003","okinawa Japan",  "25", "comment."] },
			{ "cell" : ["tanaka",   "0004","kanagawa Japan", "35", "comment."] },
			{ "cell" : ["watanabe", "0005","osaka Japan",    "30", "comment."] },
		],
		"total"  : 2
	}

以下が表示できます。
※ローカル環境のchromeで確認する場合、```--allow-file-access-from-files```オプションで起動する必要があります。


License
-----
Copyright &copy; 2013 [takuya Dosancole].
Dual licensed under the [MIT license][MIT] or [GPL Verion 2 license][GPL].
dsclgrid.js includes [jQuery]. please check each license.

[MIT]: http://www.opensource.org/licenses/mit-license.php
[GPL]: http://www.gnu.org/licenses/gpl.html
[jQuery]: http://jquery.org/
[takuya Dosancole]: https://github.com/dosancole
