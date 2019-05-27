import { Injectable } from '@angular/core';
import { Post } from './post.model'

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }


  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    }
    console.log('1')
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData)
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    })

  }

}
