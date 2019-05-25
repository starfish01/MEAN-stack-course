import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  // posts = [
  //   {title:'First Post',content:'This is one'},
  //   {title:'Second Post',content:'This is two'},
  //   {title:'Third Post',content:'This is three'}
  // ]

  posts = [];

  constructor() { }

  ngOnInit() {
  }

}
