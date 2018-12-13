import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TabsetComponent } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'
  ],
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  title = 'Welcome to XPATH Getting Application!';
  bsValue: Date;
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {containerClass: 'theme-dark-blue'});
  @ViewChild(ModalDirective) public modal: ModalDirective;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;



  async savexpath() {
    await this.save().then(data => document.getElementById('labelMessage').innerHTML = data.toString());
    document.getElementById('alertss').setAttribute('class', 'alert alert-success show');
    setTimeout(function() {
      document.getElementById('alertss').setAttribute('class', 'alert alert-success fade'); }, 5000);
    setTimeout(function() {
      document.getElementById('savexpath').style.display = 'none'; }, 6000);
  }

  async showxpath(url: string) {
    if (this.checkinput(url)) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
      }
      if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
      }
      this.modal.show();
      let html = '';
      if (!this.bsValue) {
        await this.getxpath(url).then(value => html = value.toString() );
        this.displayhtml(html);
      } else {
        console.log(this.bsValue.toString());
        await this.getoldxpath(url, this.bsValue).then(value => html = value.toString() );
        this.displayhtml(html);
        document.getElementById('savexpath').style.display = 'none';

      }
      this.modal.hide();
      this.urlvalid();
    } else {
      this.urlnotvalid();
      this.fail();
    }


  }

  displayhtml(html: string) {
    if (html !== '') {
      document.getElementById('show').setAttribute('srcdoc', html);
      this.success();
    } else {document.getElementById('show').setAttribute('srcdoc', '<h1>Error 404: Not Found<h1>');
      this.fail();
    }
  }

  getoldxpath(url: string, date: Date) {
    const params = new HttpParams();
    params.set('url', url);
    params.set('date', date.toString());
    return this.http.get('http://localhost:8080/xpath/getoldxpath/', {params}).toPromise();
  }

  checkinput(input: string) {
    if (input.length > 0) {
      return true;
    } else { return false; }
  }

  getxpath(url: string) {
    const cpHeadears = new HttpHeaders({'Content-Type': 'application/json'});
    // const options = new RequestOptions({headers: cpHeadears});
    return this.http.post('http://localhost:8080/xpath/getxpath4', url, null).toPromise();
  }

  save() {
    return this.http.get('http://localhost:8080/xpath/save/').toPromise();
  }

  urlnotvalid() {
    document.getElementById('url').focus();
    document.getElementById('divError').style.display = 'block';
    document.getElementById('url').style.borderColor = 'red';
    document.getElementById('show').style.border = 'none';
    document.getElementById('show').setAttribute('srcdoc', '');
    document.getElementById('labelMessage').innerHTML = '';
    document.getElementById('show').style.background = '#f0f0f0';
  }
  urlnotvalid2() {
    document.getElementById('url2').focus();
    document.getElementById('divError1').style.display = 'block';
    document.getElementById('url2').style.borderColor = 'red';
    document.getElementById('show').style.border = 'none';
    document.getElementById('show').setAttribute('srcdoc', '');
    document.getElementById('labelMessage').innerHTML = '';
    document.getElementById('show').style.background = '#f0f0f0';
  }
  urlvalid() {
    document.getElementById('show').style.background = 'white';
    document.getElementById('show').style.border = 'ridge';
    document.getElementById('labelMessage').innerHTML = '';
  }
  fail() {
    document.getElementById('savexpath').style.display = 'none';
    document.getElementById('show').style.background = '#f0f0f0';
  }
  success() {
    document.getElementById('savexpath').style.display = 'inline';
  }

  validate(url: string) {
    const pattern = new RegExp('^((https?:)?\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater
    const pattern2 = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i');
    if (url !== '') {
      if (pattern.test(url) || pattern2.test(url)) {
        document.getElementById('btngetxpath').removeAttribute('disabled');
        document.getElementById('divError').style.display = 'none';
        document.getElementById('url').style.borderColor = 'green';
      } else {
        document.getElementById('divError').innerText = 'URL is not valid!';
        document.getElementById('btngetxpath').setAttribute('disabled', 'disabled');
        document.getElementById('divError').style.display = 'block';
        document.getElementById('url').style.borderColor = 'red';
      }
    } else {
      document.getElementById('btngetxpath').setAttribute('disabled', 'disabled');
      document.getElementById('divError').style.display = 'block';
      document.getElementById('divError').innerText = 'URL is required!';
      document.getElementById('url').style.borderColor = 'red';
    }
  }

  validate2(url: string, content: string) {
    const pattern = new RegExp('^((https?:)?\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater
    const pattern2 = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i');
    if (url !== '') {
      if (pattern.test(url) || pattern2.test(url)) {
        document.getElementById('divError1').style.display = 'none';
        document.getElementById('url2').style.borderColor = 'green';
        if (content !== '') {
          document.getElementById('btngetxpath2').removeAttribute('disabled');
          document.getElementById('divError2').style.display = 'none';
          document.getElementById('content').style.borderColor = 'green';
        } else {
          document.getElementById('btngetxpath2').setAttribute('disabled', 'disabled');
          document.getElementById('divError2').style.display = 'block';
          document.getElementById('content').style.borderColor = 'red';
        }
      } else {
        document.getElementById('divError1').innerText = 'URL is not valid!';
        document.getElementById('btngetxpath2').setAttribute('disabled', 'disabled');
        document.getElementById('divError1').style.display = 'block';
        document.getElementById('url2').style.borderColor = 'red';
      }
    } else {
      document.getElementById('btngetxpath2').setAttribute('disabled', 'disabled');
      document.getElementById('divError1').style.display = 'block';
      document.getElementById('divError1').innerText = 'URL is required!';
      document.getElementById('url2').style.borderColor = 'red';
    }
  }

  async showxpath2(url: string, content: string) {
    if (this.checkinput(url)) {
      if (this.checkinput(content)) {
        document.getElementById('divError2').style.display = 'none';
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'http://' + url;
        }
        if (url.endsWith('/')) {
          url = url.substring(0, url.length - 1);
        }
        this.modal.show();
        let html = '';
        await this.getxpath2(url, content).then(value => html = value.toString() );
        this.displayhtml(html);
        this.modal.hide();
        this.urlvalid();
      } else {
        document.getElementById('divError2').style.display = 'block';
        this.fail();
      }
    } else {
      this.urlnotvalid2();
      this.fail();
    }
  }

  getxpath2(url: string, content: string) {
    const cpHeadears = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    // const options = new RequestOptions({headers: cpHeadears});
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('url', url);
    urlSearchParams.append('content', content);
    const body = urlSearchParams.toString();
    return this.http.post('http://localhost:8080/xpath/getxpath5', body, null).toPromise();
  }
}
