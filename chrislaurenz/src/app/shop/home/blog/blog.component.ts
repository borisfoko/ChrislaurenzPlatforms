import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog.service';
import { Blog, Post } from 'src/app/shared/classes/blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public blogs: Blog[] = [];
  public posts: Post[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit() { 
    this.blogService.getBlogs().subscribe(data => { this.blogs = data; }, error => { console.log(error); }); 
  }

  // Slick slider config
  public blogSlideConfig: any = {
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [{
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  };
}