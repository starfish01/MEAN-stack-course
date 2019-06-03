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

  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts:Post[], postCount:number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount
        this.isLoading = false;
      })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(postID: string) {
    this.isLoading = true
    this.postsService.deletePost(postID).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    })
  }

  onChangePage(pageDate: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageDate.pageIndex + 1;
    this.postsPerPage = pageDate.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
  }

}
