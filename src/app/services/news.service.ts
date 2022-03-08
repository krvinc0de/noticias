import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  constructor( private http: HttpClient ) { }

  private getArticlesByCategory(category: string): Observable<Article[]>{
    if(Object.keys(this.articlesByCategoryAndPage).includes(category)){
      // Ya Existe la Categoria
      this.articlesByCategoryAndPage[category].page += 1
    }else{
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
      .pipe(
        map( ({ articles}) => {
          if(articles.length === 0) return this.articlesByCategoryAndPage[category].articles

          this.articlesByCategoryAndPage[category] = {
            page: page,
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          }

          return articles
        })
      )
  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ):Observable<Article[]>{
    if(loadMore){
      return this.getArticlesByCategory(category)
    }

    if(this.articlesByCategoryAndPage[category]){
      return of(this.articlesByCategoryAndPage[category].articles)
    }

    return this.getTopHeadlinesByCategory( category )
  }

  private executeQuery<T>( endpoint: string){
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey,
        country: 'us'
      }
    })
  }
  
  getTopHeadersLines():Observable<Article[]>{
    return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
      .pipe(
      map( ({ articles }) => articles)
    );
  }

  getTopHeadersLinesByCategory(category: string):Observable<Article[]>{
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}`)
      .pipe(
      map( ({ articles }) => articles)
    );
  }
}
