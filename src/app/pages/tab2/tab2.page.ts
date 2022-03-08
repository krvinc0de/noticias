import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ]
  public selectedCatogory: string = this.categories[0]
  public articles: Article[] = []

  constructor(private newService: NewsService) {}

  ngOnInit(): void { 
    this.newService.getTopHeadersLinesByCategory(this.selectedCatogory)
        .subscribe( articles => {
          this.articles = [ ...articles ]
        })
  }

  segmentChanged( event: any ){
    this.selectedCatogory = event.detail.value
    this.newService.getTopHeadersLinesByCategory(this.selectedCatogory)
        .subscribe( articles => {
          this.articles = [ ...articles ]
        })
    console.log(event.detail.value)
  }

}
