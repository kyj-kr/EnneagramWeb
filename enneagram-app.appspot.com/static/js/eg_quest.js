Array.prototype.contains = function(element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
}
Array.prototype.indexOf = function(object) {
    for (var i = 0, length = this.length; i < length; i++)
        if (this[i] == object) return i;
    return -1;
};
Array.prototype.remove = function(object) {
    var from = this.indexOf(object);
    var to = from;
    var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
};

var q_row = "table#quest_list tr";
var q_data = {
	'A' : {
		'A' : [],
		'B' : [],
		'C' : []
	},
	'B' : {
		'X' : [],
		'Y' : [],
		'Z' : []
	}
};
var gid_arr = ['A', 'B'];
var qid_arr = [['A','B','C'], ['X','Y','Z']];
function get_type(str){
	var tmp;
	switch(str){
		case 'AX':
			tmp = 7;
			break;
		case 'AY':
			tmp = 8;
			break;
		case 'AZ':
			tmp = 3;
			break;
		case 'BX':
			tmp = 9;
			break;
		case 'BY':
			tmp = 4;
			break;
		case 'BZ':
			tmp = 5;
			break;
		case 'CX':
			tmp = 2;
			break;
		case 'CY':
			tmp = 6;
			break;
		case 'CZ':
			tmp = 1;
			break;
	}
	return tmp;
}
function get_result(){
	var tgrp = [[],[]];
	var grp_a = '';
	var grp_b = '';
	//alert(q_data.A.A.length);
	
	for(var i=0; i<gid_arr.length; i++){
		//alert(gid_arr[i]);
		var tcnt = 0;
		for(var j=0; j<qid_arr[i].length; j++){
			//alert(qid_arr[i][j]);
			var qd_str = 'q_data.'+gid_arr[i]+'.'+qid_arr[i][j];
			var q_cnt = eval(qd_str+'.length');
			if(q_cnt >= tcnt && q_cnt != 0){
				if(q_cnt > tcnt){
					tgrp[i] = [qid_arr[i][j]];
				}else{
					tgrp[i].push(qid_arr[i][j]);
				}
				tcnt = q_cnt;
			}
		}
	}
	
	return tgrp;
	
}
function q_click(){
	var tgrpA = $('span#grp_A').text();
	var tgrpB = $('span#grp_B').text();
	var tgrp, str1, str2;
	if(tgrpA >= 50 && tgrpB >= 50){
		tgrp = get_result();
		
		if(tgrp[0].length > 0 && tgrp[1].length > 0){
			var tmp_arr = [];
			for(var i=0; i<tgrp[0].length; i++){
				var t1 = tgrp[0][i];
				for(var j=0; j<tgrp[1].length; j++){
					var t2 = t1 + tgrp[1][j];
					tmp_arr.push(get_type(t2));
				}
				//alert(tmp);
			}
			//alert(tmp_arr);
			if(tmp_arr.length > 1){
				str1 = '집계된 예상 유형이 두가지 이상입니다. 다시 한번 항목을 신중히 검토해 보시길 바랍니다.';
			}else{
				str1 = '당신의 예상 유형은 다음과 같습니다.';
			}
			str2 = '';
			for(var i=0;i<tmp_arr.length;i++){
				str2 += "<a href='/type"+tmp_arr[i]+"' target='_self'>";
				str2 += "<span class='s_rect b_color1 s_list'> Type "+tmp_arr[i]+"</span></a> "; 
			}
		}else{
			str1 = '각 그룹별로 해당되는 유형이 하나라도 있어야 합니다. 항목을 다시 체크 해 주시기 바랍니다.';
			str2 = '';
		}
	}else{
		str1 = '집계할 자료가 부족하므로<br/> 퀘스트를 더 진행하여야 합니다.';
		str2 = '';
	}
	$('p#q_desc').html(str1);
	$('p#q_result').html(str2);
}


$(function() {
	$(q_row).mouseover(function() {
		//mouseover
		$(this).addClass("m_over");
	});
	$(q_row).mouseout(function() {
		//mouseout
		$(this).removeClass("m_over");
	});
	//label click
	$('label').click(function() {
		if(!$(this).children('span').hasClass('q_selected')){
			$(this).children('span').addClass('q_selected');
			$(this).parent('.toggle').siblings('.toggle').children('label').children('span').removeClass('q_selected');
			
			var qval = $(this).parent('div').attr('q_val')
			var qids = $(this).parent('div').parent('div').attr('qid');
			qids = qids.split('_');
			//alert(qval);
			var tmp = $(this).parent('div').parent('div').parent('td').parent('tr');
			var qstr = tmp.children("td[q_label='q_str']").children('span');
			//alert(qstr.html())
			var q_style = ['q_style1', 'q_style2'];
			
			var tmpStr = 'q_data.'+qids[0]+'.'+qids[1];
			var t_data = eval(tmpStr);
			//alert(tmpStr);
			if (qval == 0) {
				q_style = [q_style[1], q_style[0]];
				
				if(t_data.contains(qids[2])){
					t_data.remove(qids[2]);
				}
			} else {
				if(!t_data.contains(qids[2])){
					t_data.push(qids[2]);
				}
			}
			
			if (!qstr.hasClass(q_style[0])) {
				qstr.addClass(q_style[0]);
				if (qstr.hasClass(q_style[1])) {
					qstr.removeClass(q_style[1]);
				}
			}
			$(this).parent('div').parent('div').parent('td').parent('tr').attr('checked', qval);
			
			tmp = "$(\'fieldset#q_group" + qids[0] + " tr[checked]\')"
			var q_cnt = eval(tmp).length;
			var avg = parseInt(q_cnt * 100 / eval('grp' + qids[0] + '_len'));
			tmp = eval("$('span#grp_"+qids[0]+"')")
			tmp.text(avg);
			//alert(avg);
			q_click();
		}
		
	});
});

var grpA_len, grpB_len;
$(document).ready(function() {
    grpA_len = $('fieldset#q_groupA table tr').length
	grpB_len = $('fieldset#q_groupB table tr').length
	
});
