import {Component, OnInit, Input, OnDestroy} from '@angular/core';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';
import {AuthService} from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

    posts: Post[] = [];
    private postsSub: Subscription;

    private authListenerSubs: Subscription;
    userIsAuthenticated = false;

    isLoading = false;
    userId: string;

    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(public postsService: PostsService, private authService: AuthService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((postData: { posts: Post[], postCount: number }) => {
                this.posts = postData.posts;
                this.totalPosts = postData.postCount;
                this.isLoading = false;
            });
        // The below is needed so that when a user logs in they cant then have access
        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authListenerSubs.unsubscribe();
    }

    onDelete(postID: string) {
        this.isLoading = true;
        this.postsService.deletePost(postID).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onChangePage(pageDate: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageDate.pageIndex + 1;
        this.postsPerPage = pageDate.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

}
