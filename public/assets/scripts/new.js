// jshint esversion: 9
'use strict';

/* global $, jQuery */

function solution() {
    document.getElementbyId(comment - list).innerHTML = "Loading...";
    let data = fetch('https://www.example.com/comments?count=10');

    for (let i = 0; i< data.length;i++){
        document.getElementbyId('comment-list').innerHTML += `<div class="comment-item">
    <div class="comment-item__username">${data[i].username}</div>
    <div class="comment-item__message">${data[i].message}</div>
     </div>`
    }


}
