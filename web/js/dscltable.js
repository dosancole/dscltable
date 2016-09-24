/*
 * dscltable.js for jQuery - v2.0
 * http://www.dosancole.com/dscltable/
 *
 * Copyright (c) 2013 takuya Dosancole.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */

(function ($) {
    $.addDscltable = function (t, p) {
        if (t.table)
            return false;
        // -----------------------------
        // apply default props.
        // -----------------------------
        p = $.extend({
            page: 1,
            total: 9,
            rp: 10,
            order: false,
            method: "POST",
            tableClass: "",
            tableLoadingImage: false,
            pager: false,
            pagerPrevText: "prev",
            pagerNextText: "next",
            pagerClass: "",
            pagerPrevClass: "",
            pagerNextClass: "",
            pagerPrevDisableClass: "",
            pagerNextDisableClass: "",
            pagerPageClass: "",
            pagerLoadingImage: false,
            noRecordMessage: "no record.",
            ajaxErrorMessage: "ajax error",
            selectable: false,
            selectRowClass: "rowselect",
            selectableRadio: false,
            selectableRadioTH: "",
            sortable: false,
            sortCol: [],
            sortAsc: [],
            sortColn: [],
            sortBase: '',
            sortNum: 1,
            sortAscText: '▼',
            sortDescText: '▲',
            vertical: false,
            verticalStart: 1,
            verticalLength: 2,
            verticalTH: "contents",
            forceScrollTop: true,
            onReady: false,
            onClick: false,
            onDblClick: false,
            onLoad: false,
            onSelectChanged: false,
            page: 1,
            pages: 1,
            autosize: false,
            autoMarginWidth: 100,
            autoMarginHeight: 200,
            empty: true
        }, p);

        if (p.autosize) {
            /*p.width = ($(window).width() - p.autoMarginWidth) + "px";*/
            p.height = ($(window).height() - p.autoMarginHeight) + "px";
        }
        p.order = p.sortBase;

        // -----------------------------
        // create table class.
        // -----------------------------
        var table = {
            createTableHeader: function () {
                p.myheader.empty();
                p.mytable.empty();
                var html = '<tr>';
                var vIndex = 0;
                if (p.selectable && p.selectableRadio) {
                    vIndex++;
                    html += '<th data-coln="-1">' + p.selectableRadioTH + '</th>';
                }
                var createHtmlFunc = function (i, m) {
                    var tdClass = m.tdClass ? ' class="' + m.tdClass + '" ' : '';
                    var width = m.width ? ' style="width:' + m.width + ';" ' : '';
                    if (p.sortable && (m.sortable == null || m.sortable)) {
                        return '<th' + tdClass + width + ' data-coln="' + i + '">' + m.display + '<span style="float:right!important;display:none;" class="sort-desc">' + p.sortDescText + '</span><span style="float:right!important;display:none;" class="sort-asc">' + p.sortAscText + '</span><span style="float:right!important;display:none;" class="sort-none">' + p.sortNoneText + '</span></th>';
                    } else {
                        return '<th' + tdClass + width + ' data-coln="' + i + '">' + m.display + '</th>';
                    }
                };
                if (p.vertical) {
                    $.each(p.model, function (i, m) {
                        if (vIndex == p.verticalStart) {
                            html += '<th colspan="2" data-coln="-1">' + p.verticalTH + '</th>';
                        } else if (p.verticalStart < vIndex && vIndex < p.verticalStart + p.verticalLength) {
                            // skip
                        } else {
                            html += createHtmlFunc(i, m);
                        }
                        vIndex++;
                    });
                } else {
                    $.each(p.model, function (i, m) {
                        html += createHtmlFunc(i, m);
                    });
                }
                p.myheader.html(html);
                if (p.sortable) {
                    p.myheader.find('.sort-asc,.sort-desc').hide();
                    p.myheader.find('.sort-none').show();
                    $.each(p.sortColn, function (i, coln) {
                        // 縦表示の場合の調整処理
                        if (p.vertical && p.verticalStart <= coln) {
                            coln = coln - p.verticalLength + 1;
                        }
                        p.myheader.find('tr th:eq(' + coln + ') .sort-none').hide();
                        p.myheader.find('tr th:eq(' + coln + ') .sort-' + p.sortAsc[i]).show();
                    });
                }
            },
            createEmptyTable: function (message) {
                table.createTableHeader();
                var colspan = p.model.length;
                if (p.selectable && p.selectableRadio) {
                    colspan += 1;
                }
                p.mytable.append(
                    '<tr><td style="text-align:center;" colspan="' + colspan + '">' + message + '</td></tr>');
                $('.pPage', p.mypager).html('- / -');
                p.pages = 1;
                p.page = 1;
                p.total = 0;
                table.bindHandler();
                table.updatePageStatus(false);
            },
            createTable: function (data) {
                var html = '';
                $.each(data.rows, function (i, row) {
                    var even = (i % 2 == 0);
                    html += '<tr class="datarow ' + (even ? ' even' : '') + (row.cl ? row.cl : '') + '">';

                    var vIndex = 0;
                    if (p.selectable && p.selectableRadio) {
                        if (p.vertical && vIndex < p.verticalStart) {
                            html += '<td rowspan="' + p.verticalLength + '"><input type="radio" name="rowselect"></input></td>';
                        } else {
                            html += '<td><input type="radio" name="rowselect"></input></td>';
                        }
                        vIndex++;
                    }
                    if (p.vertical) {
                        var vHtml = '';
                        $.each(row.cell, function (i, c) {
                            var tdClass = p.model[i].tdClass ? ' class="' + p.model[i].tdClass + '" ' : '';
                            var align = p.model[i].align ? 'text-align:' + p.model[i].align + ';' : '';
                            if (vIndex < p.verticalStart || p.verticalStart + p.verticalLength <= vIndex) {
                                var width = p.model[i].width ? 'width:' + p.model[i].width + ';' : '';
                                html += '<td rowspan="' + p.verticalLength + '"' + tdClass + ' style="' + width + align + '">' + c + '</td>';
                            } else {
                                if (vIndex == p.verticalStart) {
                                    html += '<th>' + p.model[i].display + '</th>';
                                    html += '<td class="' + p.model[i].tdClass + '" style="' + align + '">' + c + '</td>';
                                } else {
                                    vHtml += '<tr class="' + (even ? ' even' : '') + '"><th>' + p.model[i].display + '</th>';
                                    vHtml += '<td class="' + p.model[i].tdClass + '" style="' + align + '">' + c + '</td></tr>';
                                }
                            }
                            vIndex++;
                        });
                        html += '</tr>';
                        html += vHtml;
                    } else {
                        $.each(row.cell, function (i, c) {
                            var tdClass = p.model[i].tdClass ? ' class="' + p.model[i].tdClass + '" ' : '';
                            var align = p.model[i].align ? 'text-align:' + p.model[i].align + ';' : '';
                            var width = p.model[i].width ? 'width:' + p.model[i].width + ';' : '';
                            html += '<td' + tdClass + ' style="' + width + align + '">' + c + '</td>';
                            vIndex++;
                        });
                        html += '</tr>';
                    }
                });
                table.createTableHeader();
                p.mytable.append(html);
                if( p.forceScrollTop ){
                    p.mytableview.scrollTop(0);
                }
                html = null;

                //data binding
                var rowLength = 0;
                if (data) {
                    rowLength = data.rows.length;
                }
                p.mytable.find('tr.datarow').each(function (num) {
                    var $t = $(this);
                    var rowNo = num + 1;
                    if (num < rowLength) {
                        $t.data('id', data.rows[num].id)
                        $t.data('versionNo', data.rows[num].versionNo);
                        $t.data('cell', data.rows[num].cell);
                        $t.data('hidden', data.rows[num].hidden);
                        $t.data('row', rowNo);
                    }
                    $t.addClass('row' + rowNo);
                });
                if (p.vertical) {
                    // 上で設定したrowNoとdataを使って、verticalRowに設定する。
                    var rowNo = 0;
                    var $from;
                    p.mytable.find('tr').each(function (num) {
                        var $t = $(this);
                        if ($t.data('row')) {
                            rowNo = $t.data('row');
                            $from = $t;
                        } else {
                            $t.addClass('verticalRow row' + rowNo);
                            $t.data('id', $from.data('id'));
                            $t.data('versionNo', $from.data('versionNo'));
                            $t.data('cell', $from.data('cell'));;
                            $t.data('hidden', $from.data('hidden'));
                            $t.data('row', $from.data('row'));
                        }
                    });
                };

                p.total = data.total;
                p.pages = Math.ceil(p.total / p.rp);
                table.bindHandler();
            },
            bindHandler: function () {
                // clickable
                if (p.selectable && !p.empty) {
                    p.mytable.find('tr.datarow,tr.verticalRow').css('cursor', 'pointer').click(function () {
                        var $t = $(this);
                        p.mytable.find('tr.' + p.selectRowClass.split(' ')[0]).removeClass(p.selectRowClass);
                        p.mytable.find('tr.row' + $t.data('row')).addClass(p.selectRowClass);
                        if (p.selectable && p.selectableRadio) {
                            p.mytable.find('tr.row' + $t.data('row') + ' td:first input').attr('checked', 'checked');
                        }
                        if (p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        if (p.onClick) {
                            p.onClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    }).dblclick(function () {
                        if (p.onDblClick) {
                            var $t = $(this);
                            p.onDblClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    });
                }
                // rowlink
                p.mytable.find('.rowlink').click(function (e) {
                    var $link = $(this);
                    var $t = $link.closest('tr');
                    p.onRowLink($link.text(), $t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
                // sortable
                if (p.sortable) {
                    // attach css
                    p.myheader.find('tr th' + (p.selectableRadio ? ':gt(0)' : '')).click(function () {
                        var coln = $(this).data('coln');
                        if (coln != -1 && (p.model[coln].sortable == null || p.model[coln].sortable)) {
                            var targetName = p.model[coln].name;
                            var hit = -1;
                            $.each(p.sortCol, function (i, sc) {
                                if (targetName == sc) {
                                    hit = i;
                                    return false;
                                }
                            });
                            if (hit != -1) {
                                // あれば、逆順に
                                p.sortAsc[hit] = (p.sortAsc[hit] == 'asc') ? 'desc' : 'asc';
                            } else {
                                // なければ(hit=-1)最後に追加
                                p.sortCol.push(targetName);
                                p.sortAsc.push('asc');
                                p.sortColn.push(coln);
                            }
                            if (p.sortCol.length > p.sortNum) {
                                // 多い場合、最初を削除
                                p.sortCol.splice(0, p.sortCol.length - p.sortNum);
                                p.sortAsc.splice(0, p.sortAsc.length - p.sortNum);
                                p.sortColn.splice(0, p.sortColn.length - p.sortNum);
                            }

                            table.createOrder();
                            //p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                            //p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                            table.loadData();
                        }
                    }).each(function (i) {
                        var coln = $(this).data('coln');
                        if (coln != -1 && (p.model[coln].sortable == null || p.model[coln].sortable)) {
                            $(this).css('cursor', 'pointer');
                        }
                    });
                    // attach click event
                }
            },
            createPager: function () {
                p.mypager.empty();
                p.mypager.html(
                    '<tr><td style="text-align:left;width:30%;"><a class="pPrev ' + p.pagerPrevClass + '">' + p.pagerPrevText + '</a></td>' +
                    '<td style="text-align:center;"><span class="pPage ' + p.pagerPageClass + '">- / -</span></td>' +
                    '<td style="text-align:right;width:30%;"><a class="pNext ' + p.pagerPrevClass + '">' + p.pagerNextText + '</a></td></tr>'
                );
                $('.pPrev', p.mypager).click(function () {
                    table.changePage('prev')
                });
                $('.pNext', p.mypager).click(function () {
                    table.changePage('next')
                });
                p.mypager.css("display", "none");
                /*table.updatePageStatus(true);*/
            },
            changePage: function (ctype) {
                if (p.loading) {
                    return true;
                }
                switch (ctype) {
                case 'prev':
                    if (p.page > 1) {
                        p.newp = parseInt(p.page) - 1;
                    }
                    break;
                case 'next':
                    if (p.page < p.pages) {
                        p.newp = parseInt(p.page) + 1;
                    }
                    break;
                }
                if (p.newp == p.page) {
                    return false;
                }
                table.loadData();
            },
            updatePageStatus: function (disabled) {
                if (p.pager) {
                    p.mypager.show();
                    if (disabled) {
                        if (p.pagerLoadingImage) {
                            $('.pPage', p.mypager).html(p.pagerLoadingImage + ' / ' + p.pages);
                        } else {
                            $('.pPage', p.mypager).html('* / ' + p.pages);
                        }
                    } else {
                        $('.pPage', p.mypager).html(p.page + ' / ' + p.pages);
                    }
                    if (p.page == 1 || disabled) {
                        $('.pPrev', p.mypager).attr('class', 'pPrev ' + p.pagerPrevDisableClass);
                    } else {
                        $('.pPrev', p.mypager).attr('class', 'pPrev ' + p.pagerPrevClass);
                    }
                    if (p.page == p.pages || disabled) {
                        $('.pNext', p.mypager).attr('class', 'pNext ' + p.pagerNextDisableClass);
                    } else {
                        $('.pNext', p.mypager).attr('class', 'pNext ' + p.pagerNextClass);
                    }
                }
            },
            loadData: function (userParam) {
                if (p.loading) {
                    return true;
                }
                if (!p.url) {
                    return false;
                }
                if (!p.newp) {
                    p.newp = 1;
                }

                // first parameter is [page].
                var param = [{
                    name: 'page',
                    value: p.newp
                }, {
                    name: 'rp',
                    value: p.rp
                }];

                /*if (p.sortBase) {
                    param.push({
                        name: 'order',
                        value: p.sortBase
                    });
                }*/

                // set userParam.
                if (userParam) {
                    p.userParam = userParam
                }

                // set userParamValue
                var userOrder = false;
                if (p.userParam) {
                    $.each(p.userParam, function (k, v) {
                        if (p.sortable && k == 'order') {
                            userOrder = true;
                            table.parseSorterOrder(v);
                            table.createOrder();
                            v = p.order;
                        } else if (k == 'page' && userParam) {
                            param.splice(0, 1);
                            p.newp = v;
                        }
                        param.push({
                            name: k,
                            value: v
                        });
                    });
                }
                if (p.sortable) {
                    if (!userOrder) {
                        param.push({
                            name: 'order',
                            value: p.order
                        });
                    } else {
                        delete userParam.order;
                    }
                } else {
                    param.push({
                        name: 'order',
                        value: p.order
                    });
                }
                p.loading = true;
                table.handleLoading(true);

                $.ajax({
                    type: p.method,
                    url: p.url,
                    data: param,
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        if (data.error != null && data.error.length > 0) {
                            p.empty = true;
                            table.createEmptyTable(data.error);
                        } else {
                            if (data.rows.length > 0) {
                                p.empty = false;
                                table.createTable(data);
                                p.page = data.page;
                            } else {
                                p.empty = true;
                                table.createEmptyTable(p.noRecordMessage);
                            }
                        }
                        p.mytable.show();
                        if (p.pager) {
                            table.updatePageStatus(false);
                        }
                        if (p.onLoad) {
                            p.onLoad(data);
                        }
                        if (p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        p.loading = false;
                        table.handleLoading(false);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        table.createEmptyTable(p.ajaxErrorMessage);
                        p.mytable.show();
                        try {
                            if (p.onError) {
                                p.onError(XMLHttpRequest, textStatus, errorThrown);
                            }
                        } catch (e) {}
                        p.loading = false;
                        table.handleLoading(false);
                    }
                });
            },
            handleLoading: function (loading) {
                if (loading) {
                    table.updatePageStatus(true);
                    if (p.tableLoadingImage) {
                        if (p.mytableview.position().top != 0 || p.mytableview.position().left != 0) {
                            //console.log(p.mytableview.position().top + ',' + p.mytableview.height());
                            //console.log(p.mytableview.position().left + ',' + p.mytableview.width());
                            p.myloading.css({
                                position: "absolute",
                                top: (p.mytableview.position().top + p.mytableview.height() / 2 - 26) + "px",
                                left: (p.mytableview.position().left + p.mytableview.width() / 2 - 26) + "px"
                            });
                            p.myloading.show();
                        }
                    }
                } else {
                    if (p.tableLoadingImage) {
                        p.myloading.css("display", "none");
                    }
                }
            },
            selectByNo: function (no) {
                // clear select.
                p.mytable.find('tr.' + p.selectRowClass.split(' ')[0]).removeClass(p.selectRowClass);
                // select.
                var selector = 'tr.row' + (no + 1);
                $(selector, p.mytable).addClass(p.selectRowClass);
                if (p.selectable && p.selectableRadio) {
                    $(selector + ' td:first input', p.mytable).attr('checked', 'checked');
                }
                if (p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            selectById: function (id) {
                // clear select.
                p.mytable.find('tr.' + p.selectRowClass.split(' ')[0]).removeClass(p.selectRowClass);
                // select.
                var idStr = '' + id;
                $('tr.datarow', p.mytable).each(function (num) {
                    if ($(this).data('id') == idStr) {
                        var selector = 'tr.row' + $(this).data('row');
                        $(selector, p.mytable).addClass(p.selectRowClass);
                        if (p.selectable && p.selectableRadio) {
                            $(selector + ' td:first input', p.mytable).attr('checked', 'checked');
                        }
                        return false;
                    }
                });
                if (p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            getSelectedNo: function () {
                var selectedTr = $('tr.' + p.selectRowClass.split(' ')[0] + ':first', p.mytable);
                if (selectedTr) {
                    var r = selectedTr.data('row');
                    if (r) {
                        return r - 1;
                    }
                }
                return -1;
            },
            getSelectedId: function () {
                var selectedTr = $('tr.' + p.selectRowClass.split(' ')[0] + ':first', p.mytable);
                if (selectedTr) {
                    var r = selectedTr.data('id');
                    if (r) {
                        return r;
                    }
                }
                return -1;
            },
            getSelectedCell: function () {
                return table.getSelected('cell');
            },
            getSelectedHidden: function () {
                return table.getSelected('hidden');
            },
            getSelected: function (attr) {
                var selectedTr = $('tr.' + p.selectRowClass.split(' ')[0] + ':first', p.mytable);
                if (selectedTr) {
                    var r = selectedTr.data(attr);
                    if (r) {
                        return r;
                    }
                }
                return null;
            },
            parseSorterOrder: function (str) {
                var baseIndex = str.lastIndexOf(p.sortBase);
                if (baseIndex != -1) {
                    str = str.substring(0, baseIndex);
                }
                p.sortCol = [];
                p.sortAsc = [];
                p.sortColn = [];
                if (str.length > 0) {
                    var splited = str.split(',');
                    $.each(splited, function (i, s) {
                        if (s.length > 0) {
                            var ss = s.split(' ');
                            $.each(p.model, function (ii, m) {
                                if (ss[0] == m.name) {
                                    p.sortCol.push(ss[0]);
                                    p.sortAsc.push(ss[1]);
                                    p.sortColn.push(ii);
                                    return false;
                                }
                            });
                        }
                    });
                }
            },
            createOrder: function () {
                p.order = '';
                $.each(p.sortCol, function (i, sc) {
                    p.order += sc + ' ' + p.sortAsc[i] + ',';
                });
                if (p.order.length > 1) {
                    p.order = p.order.substring(0, p.order.length - 1);
                }
                if (p.sortBase.length > 1) {
                    if (p.order.length > 0) {
                        p.order += ',' + p.sortBase;
                    } else {
                        p.order = p.sortBase;
                    }
                }
            },
            changeHeight: function (height) {
                if (height > p.myheader.height() + 100) {
                    var diff = height - parseInt(p.mytableview.css('height'), 10);
                    p.height = height + 'px';
                    p.mytableview.css({
                        height: p.height
                    });
                    /*var $sData = p.mygrid.find('div.sData');
                    $sData.css({
                        height: ($sData.height() + diff) + 'px'
                    });*/
                }
            },
            destroy: function () {
                $(window).unbind('resize', p.resizeFunc);
                $(t).remove();
            }
        };
        if (p.autosize) {
            p.resizeFunc = function () {
                //console.log('reszie func');
                //grid.changeWidth($(window).width() - p.autoMarginWidth);
                table.changeHeight($(window).height() - p.autoMarginHeight);
                // myheader size change by mytable with scrollbar.
                p.myheader.css('width', p.mytable.width() + 'px');
            };
            $(window).resize(p.resizeFunc);
        }
        // -----------------------------
        // create main DOM.
        // -----------------------------
        // create myheader.
        var innerHeader = document.createElement('table');
        p.myheader = $(innerHeader);
        p.myheader.addClass(p.tableClass);
        $(t).append($('<div></div>').append(innerHeader));
        innerHeader = null;
        // create mytable.
        var innerTable = document.createElement('table');
        p.mytable = $(innerTable);
        p.mytable.addClass(p.tableClass);
        $(t).append($('<div class="tableview" style="overflow-y:scroll;"></div>').append(innerTable));
        p.mytableview = p.mytable.closest('div');
        innerTable = null;

        // myheader size change by mytable with scrollbar.
        p.myheader.css('width', p.mytable.width() + 'px');

        p.mytable.css("display", "none");
        if (p.autosize) {
            p.mytableview.css({
                height: p.height
            });
        }
        t.p = p;
        t.table = table;

        // create loding
        if (p.tableLoadingImage) {
            var divLoading = document.createElement('div');
            p.myloading = $(divLoading)
            p.myloading.css("display", "none");
            p.myloading.html(p.tableLoadingImage);
            $(t).append(divLoading);
            divLoading = null;
        }

        // create mypager
        if (p.pager) {
            var innerPager = document.createElement('table');
            p.mypager = $(innerPager);
            p.mypager.addClass(p.pagerClass);
            $(t).append(innerPager);
            innerPager = null;
            table.createPager();
        }

        table.createEmptyTable();

        if (p.onReady) {
            if (p.pager && p.pagerLoadingImage) {
                p.onReady();
            } else {
                p.onReady();
            }
        }

        return t;
    };
    var docloaded = false;
    $(document).ready(function () {
        docloaded = true
    });

    $.fn.dscltable = function (p) {
        return this.each(function () {
            if (!docloaded) {
                $(this).hide();
                var t = this;
                $(document).ready(function () {
                    $.addDscltable(t, p);
                });
            } else {
                $.addDscltable(this, p);
            }
        });
    };
    $.fn.dscltableLoad = function (param) {
        return this.each(function () {
            if (this.table) {
                if (param) {
                    this.table.loadData(param);
                } else {
                    this.table.loadData();
                }
            }
        });
    };
    $.fn.dscltableSelectByNo = function (no) {
        return this.each(function () {
            if (this.table) {
                this.table.selectByNo(no);
            }
        });
    };
    $.fn.dscltableSelectById = function (id) {
        return this.each(function () {
            if (this.table) {
                this.table.selectById(id);
            }
        });
    };
    $.fn.dscltableGetSelectedNo = function () {
        var r;
        this.each(function () {
            if (this.table) {
                r = this.table.getSelectedNo();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedId = function () {
        var r;
        this.each(function () {
            if (this.table) {
                r = this.table.getSelectedId();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedCell = function () {
        var r;
        this.each(function () {
            if (this.table) {
                r = this.table.getSelectedCell();
            }
        });
        return r;
    };
    $.fn.dscltableGetSelectedHidden = function () {
        var r;
        this.each(function () {
            if (this.table) {
                r = this.table.getSelectedHidden();
            }
        });
        return r;
    };
    $.fn.dscltableGetUserParam = function () {
        var r;
        this.each(function () {
            if (this.table) {
                r = this.p.userParam;
            }
        });
        return r;
    };
    $.fn.dscltableDestroy = function () {
        return this.each(function () {
            if (this.table) {
                this.table.destroy();
            }
        });
    };

})(jQuery);