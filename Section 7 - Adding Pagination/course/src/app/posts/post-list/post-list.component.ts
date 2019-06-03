import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.model'
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription

  isLoading = false;

  totalPosts = 10;
  postsPerPage = 2;
  currentPage=1;
  pageSizeOptions = [1,2,5,10];

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage)
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(postID: string) {
    this.postsService.deletePost(postID)
  }

  onChangePage(pageDate:PageEvent){
    this.currentPage = pageDate.pageIndex +1;
    this.postsPerPage = pageDate.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage)
  }

}
