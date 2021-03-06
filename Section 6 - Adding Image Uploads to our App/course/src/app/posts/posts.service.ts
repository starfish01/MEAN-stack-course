import { Injectable } from '@angular/core';
import { Post } from './post.model'

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        });
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {

    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>("http://localhost:3000/api/posts/" + postId)
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }


  addPost(title: string, content: string, image: File) {
    // The below cant be used because we cant pass a file with json
    // const post: Post = {
    //   id: null,
    //   title,
    //   content
    // }
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = { id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath }
        post.id = responseData.post.id
        this.posts.push(post)
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe(response => {
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id)
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      }
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
      this.router.navigate(['/'])
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
