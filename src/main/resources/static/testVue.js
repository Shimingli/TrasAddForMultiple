$(function(){
	var example2 = new Vue({
	  el: '#example-2',
	  data: {
	    name: 'Vue.js',
	    showLabel:false,
	    la:"hello"
	  },
	  // 在 `methods` 对象中定义方法
	  methods: {
	    greet: function (event) {
	      // `this` 在方法里指向当前 Vue 实例
	      alert('Hello ' + this.name + '!');
	      example2.showLabel = true;
	      // `event` 是原生 DOM 事件
	      if (event) {
	    	var date= new Date();
	    	date.setDate(10);
	    	alert("shijianshi :"+moment(date).format('YYYY-MM-DD h:mm:ss a'))
	        alert(event.target.tagName)
	      }
	      $("#sel").val($("#pl").html());
	      
	    }
	  }
	})
})