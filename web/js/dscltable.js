/*
 * dscltable.js for jQuery - v1.0
 * http://dosancole.github.com/dscltable/
 *
 * Copyright (c) 2013- takuya Dosancole.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */

(function($) {
	$.addDscltable = function(t, p) {
		if (t.table)
			return false;
		// -----------------------------
		// apply default props.
		// -----------------------------
		p = $.extend({
			page : 1,
			total : 9,
			rp : 10,
			method : "POST",
			tableClass : "",
			tableLoadingImage : false,
			pager : false,
			pagerPrevText: "<prev",
			pagerNextText: "next>",
			pagerClass : "",
	        pagerPrevClass : "",
	        pagerNextClass : "",
	        pagerPrevDisableClass : "",
	        pagerNextDisableClass : "",
	        pagerPageClass : "",
	        pagerLoadingImage : false,
			noRecordMessage : "no record.",
			ajaxErrorMessage : "ajax error",
			selectable : false,
			selectRowClass : "rowselect",
			selectableRadio : false,
			selectableRadioTH : "",
	        vertical : false,
			verticalStart : 1,
			verticalLength : 2,
			verticalTH : "contents",
			onReady : false,
			onClick : false,
			onDblClick : false,
			onLoad : false,
			onSelectChanged : false,
			page : 1,
			pages : 1,
			empty : true
		}, p);

		// -----------------------------
		// create table class.
		// -----------------------------
		var table = {
			createTableHeader : function() {
				p.mytable.empty();
				var html = '<tr>';
				var vIndex = 0;
				if( p.selectable && p.selectableRadio ){
					vIndex++;
					html += '<th>' + p.selectableRadioTH + '</th>';
				}
				if( p.vertical ){
					$.each(p.model, function(i, m) {
						if( vIndex == p.verticalStart ){
							html += '<th colspan="2">' + p.verticalTH + '</th>';
						}else if( p.verticalStart < vIndex && vIndex < p.verticalStart + p.verticalLength ){
							// skip
						}else{
							html += '<th>' + m.display + '</th>';
						}
						vIndex++;
					});
				}else{
					$.each(p.model, function(i, m) {
						html += '<th>' + m.display + '</th>';
					});
				}
				p.mytable.html(html);
			},
			createEmptyTable : function(message) {
				table.createTableHeader();
				var colspan = p.model.length;
				if( p.selectable && p.selectableRadio ){
					colspan+=1;
				}
				p.mytable.append(
						'<tr><td style="text-align:center;" colspan="' + colspan
								+ '">'+message+'</td></tr>');
				$('.pPage', p.mypager).html( '- / -');
				p.pages = 1;
				p.page = 1;
				p.total = 0;
				table.bindHandler();
				table.updatePageStatus(false);
			},
            createTable : function(data) {
                var html = '';
                $.each(data.rows, function(i, row) {
                    if(row.cl) {
                        if(i % 2 == 0) {
                            html += '<tr class="datarow ' + row.cl + '">';
                        } else {
                            html += '<tr class="datarow even ' + row.cl + '">';
                        }
                    } else {
                        if(i % 2 == 0) {
                            html += '<tr class="datarow">';
                        } else {
                            html += '<tr class="datarow even">';
                        }
                    }
                    var vIndex = 0;
    				if( p.selectable && p.selectableRadio ){
    					if( p.vertical && vIndex < p.verticalStart ){
	                    		html += '<td rowspan="'+p.verticalLength+'"><input type="radio" name="rowselect"></input></td>';
    					}else{
                    		html += '<td><input type="radio" name="rowselect"></input></td>';
    					}
    					vIndex++;
    				}
    				if( p.vertical ){
	    				var vHtml = '';
	                    $.each(row.cell, function(i, c) {
	                    	if( vIndex < p.verticalStart || p.verticalStart+p.verticalLength <= vIndex ){
	                    		html += '<td rowspan="'+p.verticalLength+'" class="' + p.model[i].tdClass + '">' + c + '</td>';
	                    	}else{
	                    		if( vIndex == p.verticalStart ){
	                    			html += '<th>' + p.model[i].display + '</th>';
	                    			html += '<td class="' + p.model[i].tdClass + '">' + c + '</td>';
	                    		}else{
	                    			vHtml += '<tr><th>' + p.model[i].display + '</th>';
	                    			vHtml += '<td class="' + p.model[i].tdClass + '">' + c + '</td></tr>';
	                    		}
	                    	}
	    					vIndex++;
	                    });
	                    html += '</tr>';
	                    html += vHtml;
    				}else{
	                    $.each(row.cell, function(i, c) {
	                		html += '<td class="' + p.model[i].tdClass + '">' + c + '</td>';
	    					vIndex++;
	                    });
	                    html += '</tr>';
    				}
                });
				table.createTableHeader();
				p.mytable.append(html);
				html=null;

				//data binding
                var rowLength = 0;
                if(data) {
                    rowLength = data.rows.length;
                }
				p.mytable.find('tr.datarow').each(function(num) {
                    var $t = $(this);
                    var rowNo = num+1;
                    if(num < rowLength) {
                        $t.data('id', data.rows[num].id)
                        $t.data('versionNo', data.rows[num].versionNo);
                        $t.data('cell', data.rows[num].cell);
                        $t.data('hidden', data.rows[num].hidden);
                        $t.data('row', rowNo);
                    }
                    $t.addClass('row' + rowNo);
                });
				if( p.vertical ){
	                var rowNo = 0;
	                var $from;
					p.mytable.find('tr').each(function(num) {
	                    var $t = $(this);
	                    if( num > 0 ){
	                    	if( $t.data('row') ){
	                    		rowNo = $t.data('row');
	                    		$from = $t;
	                    	}else{
	                    		$t.addClass('verticalRow row' + rowNo);
	                            $t.data('id', $from.data('id') );
	                            $t.data('versionNo', $from.data('versionNo') );
	                            $t.data('cell', $from.data('cell') );;
	                            $t.data('hidden', $from.data('hidden') );
	                            $t.data('row', $from.data('row') );
	                    	}
	                    }
					});
				};

                p.total = data.total;
                p.pages = Math.ceil(p.total / p.rp);
                table.bindHandler();
            },
            bindHandler : function() {
                // clickable
                if(p.selectable && !p.empty) {
                    p.mytable.find('tr.datarow,tr.verticalRow').css('cursor', 'pointer').click(function() {
                        var $t = $(this);
                        p.mytable.find('tr.'+p.selectRowClass.split(' ')[0] ).removeClass( p.selectRowClass );
                        p.mytable.find('tr.row' + $t.data('row')).addClass( p.selectRowClass );
        				if( p.selectable && p.selectableRadio ){
        					p.mytable.find('tr.row' + $t.data('row') +' td:first input').attr( 'checked', 'checked');
        				}
                        if(p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        if(p.onClick) {
                            p.onClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    }).dblclick(function() {
                        if(p.onDblClick) {
                            var $t = $(this);
                            p.onDblClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    });
                }
                // rowlink
                p.mytable.find('.rowlink').click( function(e) {
                	var $link = $(this);
                	var $t = $link.closest( 'tr' );
                    p.onRowLink( $link.text(), $t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
            },
            createPager : function() {
                p.mypager.empty();
                p.mypager.html(
                		'<tr><td style="text-align:left;"><a class="pPrev '+ p.pagerPrevClass +'">'+p.pagerPrevText+'</a></td>'+
                		'<td style="text-align:center;"><span class="pPage '+ p.pagerPageClass +'">- / -</span></td>'+
                		'<td style="text-align:right;"><a class="pNext '+ p.pagerPrevClass +'">'+p.pagerNextText+'</a></td></tr>'
                		);
                $('.pPrev', p.mypager).click(function() {
                    table.changePage('prev')
                });
                $('.pNext', p.mypager).click(function() {
                    table.changePage('next')
                });
                p.mypager.css("display", "none");
                /*table.updatePageStatus(true);*/
            },
            changePage : function(ctype) {
                if(p.loading) {
                    return true;
                }
                switch (ctype) {
                    case 'prev':
                        if(p.page > 1) {
                            p.newp = parseInt(p.page) - 1;
                        }
                        break;
                    case 'next':
                        if(p.page < p.pages) {
                            p.newp = parseInt(p.page) + 1;
                        }
                        break;
                }
                if(p.newp == p.page) {
                    return false;
                }
                table.loadData();
            },
            updatePageStatus : function( disabled ){
            	if( p.pager ){
            		p.mypager.show();
	            	if( disabled ){
	            		if( p.pagerLoadingImage ){
	            			$('.pPage', p.mypager).html( '<img src="'+ p.pagerLoadingImage +'" /> / ' + p.pages );
	            		}else{
	            			$('.pPage', p.mypager).html( '* / ' + p.pages );
	            		}
	            	}else{
	            		$('.pPage', p.mypager).html( p.page + ' / ' + p.pages );
	            	}
	                if( p.page == 1 || disabled ){
	                	$('.pPrev', p.mypager).attr( 'class', 'pPrev ' + p.pagerPrevDisableClass );
	                }else{
	                	$('.pPrev', p.mypager).attr( 'class', 'pPrev ' + p.pagerPrevClass );
	                }
	                if( p.page == p.pages || disabled ){
	                	$('.pNext', p.mypager).attr( 'class', 'pNext ' + p.pagerNextDisableClass );
	                }else{
	                	$('.pNext', p.mypager).attr( 'class', 'pNext ' + p.pagerNextClass );
	                }
            	}
            },
            loadData : function(userParam) {
                if(p.loading) {
                    return true;
                }
                if(!p.url) {
                    return false;
                }
                if(!p.newp) {
                    p.newp = 1;
                }

                // first parameter is [page].
                var param = [{
                    name : 'page',
                    value : p.newp
                }, {
                    name : 'rp',
                    value : p.rp
                }];

                // set userParam.
                if(userParam) {
                    p.userParam = userParam
                }
                if(p.userParam) {
                    $.each(p.userParam, function(k, v) {
                        if(k == 'page' && userParam) {
                            param.splice(0, 1);
                            p.newp = v;
                        }
                        param.push({
                            name : k,
                            value : v
                        });
                    });
                }
                p.loading = true;
                table.handleLoading(true);

                $.ajax({
                    type : p.method,
                    url : p.url,
                    data : param,
                    dataType : 'json',
                    success : function(data) {
                        if(data.error != null && data.error.length > 0) {
                            p.empty = true;
                            table.createEmptyTable(data.error);
                        } else {
                            if(data.rows.length > 0) {
                                p.empty = false;
                                table.createTable(data);
                                p.page = data.page;
                            } else {
                                p.empty = true;
                                table.createEmptyTable(p.noRecordMessage);
                            }
                        }
                        p.mytable.show();
                        if(p.pager) {
                            table.updatePageStatus(false);
                        }
                        if(p.onLoad) {
                            p.onLoad(data);
                        }
                        if(p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        p.loading = false;
                        table.handleLoading(false);
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {
                    	table.createEmptyTable(p.ajaxErrorMessage);
                        p.mytable.show();
                        try {
                            if(p.onError) {
                                p.onError(XMLHttpRequest, textStatus, errorThrown);
                            }
                        } catch (e) {
                        }
                        p.loading = false;
                        table.handleLoading(false);
                    }
                });
            },
            handleLoading : function(loading) {
            	if( loading ){
            		table.updatePageStatus( true );
            		if(p.tableLoadingImage){
	            		p.myloading.css({
	            			position: "absolute",
	            			top: (p.mytable.position().top+5) +"px",
	            			left: (p.mytable.position().left+5) +"px"
	            		});
	            		p.myloading.show();
            		}
            	}else{
            		if(p.tableLoadingImage){
            			p.myloading.css("display", "none");
            		}
            	}
            },
            selectByNo : function(no) {
                // clear select.
                p.mytable.find('tr.'+p.selectRowClass.split(' ')[0] ).removeClass( p.selectRowClass );
                // select.
                var selector = 'tr.row' + (no + 1);
                $(selector, p.mytable).addClass( p.selectRowClass );
				if( p.selectable && p.selectableRadio ){
					$(selector+' td:first input', p.mytable).attr( 'checked', 'checked');
				}
                if(p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            selectById : function(id) {
                // clear select.
                p.mytable.find('tr.'+p.selectRowClass.split(' ')[0] ).removeClass( p.selectRowClass );
                // select.
                var idStr = '' + id;
                $('tr.datarow', p.mytable).each(function(num) {
                    if($(this).data('id') == idStr) {
                        var selector = 'tr.row' + $(this).data('row');
                        $(selector, p.mytable).addClass(p.selectRowClass);
        				if( p.selectable && p.selectableRadio ){
        					$(selector+' td:first input', p.mytable).attr( 'checked', 'checked');
        				}
                        return false;
                    }
                });
                if(p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            getSelectedNo : function() {
                var selectedTr = $('tr.'+p.selectRowClass.split(' ')[0]+':first', p.mytable);
                if(selectedTr) {
                    var r = selectedTr.data('row');
                    if(r) {
                        return r - 1;
                    }
                }
                return -1;
            },
            getSelectedId : function() {
                var selectedTr = $('tr.'+p.selectRowClass.split(' ')[0]+':first', p.mytable);
                if(selectedTr) {
                    var r = selectedTr.data('id');
                    if(r) {
                        return r;
                    }
                }
                return -1;
            },
            getSelectedCell : function() {
                return table.getSelected('cell');
            },
            getSelectedHidden : function() {
                return table.getSelected('hidden');
            },
            getSelected : function( attr ){
                var selectedTr = $('tr.'+p.selectRowClass.split(' ')[0]+':first', p.mytable);
                if(selectedTr) {
                    var r = selectedTr.data(attr);
                    if(r) {
                        return r;
                    }
                }
                return null;
            }
		};
		// -----------------------------
		// create main DOM.
		// -----------------------------
		// create mytable.
		var innerTable = document.createElement('table');
		p.mytable = $(innerTable);
		p.mytable.addClass(p.tableClass);
		$(t).append(innerTable);
		innerTable = null;
		//table.createEmptyTable();

		p.mytable.css("display", "none");
		t.p = p;
		t.table = table;

		// create loding
		if(p.tableLoadingImage){
			var divLoading = document.createElement('div');
			p.myloading=$( divLoading )
	        p.myloading.css("display", "none");
			p.myloading.html('<img src="'+ p.tableLoadingImage +'" />');
			$(t).append( divLoading );
			divLoading = null;
		}

		// create mypager
        if(p.pager) {
            var innerPager = document.createElement('table');
            p.mypager = $(innerPager);
            p.mypager.addClass(p.pagerClass);
            $(t).append(innerPager);
            innerPager = null;
            table.createPager();
        }

        if( p.onReady ){
        	if( p.pager && p.pagerLoadingImage ){
                p.onReady();
        	}else{
        		p.onReady();
        	}
        }

		return t;
	};
	var docloaded = false;
	$(document).ready(function() {
		docloaded = true
	});

	$.fn.dscltable = function(p) {
		return this.each(function() {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function() {
					$.addDscltable(t, p);
				});
			} else {
				$.addDscltable(this, p);
			}
		});
	};
    $.fn.dscltableLoad = function(param) {
        return this.each(function() {
            if(this.table) {
                if(param) {
                    this.table.loadData(param);
                } else {
                    this.table.loadData();
                }
            }
        });
    };
    $.fn.dscltableSelectByNo = function(no) {
        return this.each(function() {
            if(this.table) {
                this.table.selectByNo(no);
            }
        });
    };
    $.fn.dscltableSelectById = function(id) {
        return this.each(function() {
            if(this.table) {
                this.table.selectById(id);
            }
        });
    };
    $.fn.dscltableGetSelectedNo = function() {
        var r;
        this.each(function() {
            if(this.table) {
                r = this.table.getSelectedNo();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedId = function() {
        var r;
        this.each(function() {
            if(this.table) {
                r = this.table.getSelectedId();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedCell = function() {
        var r;
        this.each(function() {
            if(this.table) {
                r = this.table.getSelectedCell();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedHidden = function() {
        var r;
        this.each(function() {
            if(this.table) {
                r = this.table.getSelectedHidden();
            }
        });
        return r;
    };
    $.fn.dscltableGetUserParam = function() {
        var r;
        this.each(function() {
            if(this.table) {
                r = this.p.userParam;
            }
        });
        return r;
    };

})(jQuery);
