import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.model'
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub:Subscription

  isLoading = false;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts()
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{
      this.posts = posts;
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(postID:string){
    this.postsService.deletePost(postID)
  }

}
