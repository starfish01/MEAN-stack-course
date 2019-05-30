import { Injectable } from '@angular/core';
import { Post } from './post.model'

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId:string){
    return {...this.posts.find(p=>p.id === postId)}
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
    this.http.post<{ message: string, postId:string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        post.id = responseData.postId
        this.posts.push(post)
        this.postsUpdated.next([...this.posts]);
      })
  }

  deletePost(postID: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postID).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postID)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }

}
