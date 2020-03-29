import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Blog, Post } from '../classes/blog';

@Injectable()
export class BlogService {
 
  private blogUrl = `${environment.serverUrl}/blog`;
  private postUrl = `${environment.serverUrl}/post`;
 
  constructor(private httpClient: HttpClient) { }
 
  public getBlogs(): Observable<Blog[]> {
    return this.httpClient.get<Blog[]>(this.blogUrl).map((res:any) => res);
  }

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postUrl).map((res:any) => res);
  }

  public addBlog(blog: Blog): Observable<string> {
    return this.httpClient.post<string>(this.blogUrl, blog).map((res:any) => res);
  }

  public addPost(post: Post): Observable<string> {
    return this.httpClient.post<string>(this.postUrl, post).map((res:any) => res);
  }
}