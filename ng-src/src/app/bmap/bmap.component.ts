import { Component, OnInit } from '@angular/core';

import * as $ from "jquery";
declare var BMap: any;
declare var BMapLib: any;
declare var BMAPLIB_TAB_SEARCH:any;
declare var BMAPLIB_TAB_TO_HERE:any;
declare var BMAPLIB_TAB_FROM_HERE:any;

interface IGymLocation {
  lati: number;
  longi: number;
}

interface IGymInfo {
  description: string;
}

@Component({
  selector: 'app-bmap',
  templateUrl: './bmap.component.html',
  styleUrls: ['./bmap.component.scss']
})
export class BMapComponent implements OnInit {

  constructor() { }

  hasInitMap = false;

  //前台模拟数据

  public gymsLocation: {[id: number]: IGymLocation;} = {
    0: {lati: 30.676, longi: 104.004},
    1: {lati: 30.613, longi: 104.068},
    2: {lati: 30.653, longi: 104.056}
  }

  public gymsInfo: {[id: number]: IGymInfo;} = {
    0: {description: "豪华健身房"},
    1: {description: "舒适健身房"},
    2: {description: "亲民价健身房"}
  }

  ngOnInit() { 
    var map = new BMap.Map("divTBMap");          // 创建地图实例  
    var point = new BMap.Point(104.0650, 30.6578);  // 创建点坐标  
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别

    //this.adjustMap(); // 调整地图大小
    this.addPoint(map, this.gymsLocation); // 运行加点函数
  }

  adjustMap() {
    // 调整地图大小
    let screenY: number = $(window).height();
    if (!this.hasInitMap) {
      $(function() {
        $("main").css("height", screenY - 45 - 54);
      });
    }
    
    $(window).resize(function() {
      screenY = $(window).height();
      $("main").css("height", screenY - 45 - 54);
    });
  }

  creategymInfoWindow(map: any, id: string): any {
    let IBOption = {
        width: 320,
        height: 280,
        title: id + " 号健身房 - " + this.gymsInfo[id]["description"],
        panel  : "panel",         //检索结果面板
        enableAutoPan : true,     //自动平移
        searchTypes : [
            BMAPLIB_TAB_SEARCH,   //周边检索
            BMAPLIB_TAB_TO_HERE,  //到这里去
            BMAPLIB_TAB_FROM_HERE //从这里出发
        ]
    };
    let infoContent = `
    <div style="text-align: center;margin-top: 3px">
      <img src="assets/images/gymCarousel1.jpg" class="img img-responsive" style="height:200px" />
    </div>
    <footer style="text-align: center; margin-top: 3px;">
      <a class="btn btn-primary btn-lg" href="../#/gym/id/`+ id + `">详情</a>
    </footer>
    `
    let gymInfoWindow = new BMapLib.SearchInfoWindow(map, infoContent, IBOption);
    return gymInfoWindow;
    
  }

  /* 加点大函数 */
  addPoint(map: any, data: any) {
    // 设置图标
		let bIcon = new BMap.Icon("assets/images/map/marker-activated.png", new BMap.Size(20, 25), {    
				// 指定定位位置。   				// 当标注显示在地图上时，其所指向的地理位置距离图标左上    				// 角各偏移10像素和25像素。您可以看到在本例中该位置即是  				// 图标中央下端的尖角位置。    
			offset: new BMap.Size(10, 25),    
				// 设置图片偏移。   				// 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   				// 需要指定大图的偏移位置，此做法与css sprites技术类似。    				// imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
		});

    let that = this;
    
    // 加点
    
    // 访问字典的模板 请大神无视
    // for (let key in data) {
    //   let value = data[key]
    // }var searchInfoWindow = null;

    for (let id in data) {
      let vLati = data[id]["lati"];
      let vLongi = data[id]["longi"];

      // 每一个数据形成点
      let bPoint = new BMap.Point(vLongi, vLati);
      // 设置每一个标记点位
      let bMarker = new BMap.Marker(bPoint, {icon: bIcon});
      bMarker.label = id;

      // 设置事件。点击某个点弹出信息框
      bMarker.addEventListener("click", function() {
        let gymInfoWindow = that.creategymInfoWindow(map, id);
        gymInfoWindow.open(bMarker);

      });

      // 把每个点摆到地图上
      map.addOverlay(bMarker);
    }
  }

}
