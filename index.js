var store={			//存取localStorage中的数据
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));//stringify 用于从一个字符串中解析出json对象 
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key))||[];//parse()用于从一个json对象中解析出 字符串
	}
}


//取出所有的值
var list = store.fetch("xiao-new-class");
	   
 var vm=new Vue({
	el:".main",
	data:{
		list:list,
		todo:""	,		//
		edtorTodos:"" ,//记录正在编辑的数据
		beforeTitle:'',//记录正在编辑的数据的title
		visibility: "all"//通过这个属性值的变化对数据进行筛选
	},
	 watch:{
		list:{
			handler:function(){   //监控list改变
				store.save("xiao-new-class",this.list);
			},
			deep:true  //深度监测
		}
	},
	computed:{
		noCheckeLength:function(){	//筛选isChecked为false
			return this.list.filter(function(item){
                return !item.isChecked
            }).length
		},
		filteredList:function(){			
			//过滤的时候有三种情况 all finished unfinished
			var filter = {
				all:function(list){
					return list;
				},
				finished:function(list){
					return list.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function(){
					return list.filter(function(item){
						return !item.isChecked;
					})
	        }
        }

			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	},
	methods:{
		addTodo(ev){			///添加任务
			this.list.push({
				title:this.todo	,
				isChecked:false  //添加新任务后默认为false,即未完成状态
			});
			this.todo="";			//回车添加成功后清空todo
		},
		deleteTodo(todo){			//删除任务
			var index=this.list.indexOf(todo);//
			this.list.splice(index,1);
		},
		edtorTodo(todo){	//双击编辑任务
			//编辑任务的时候，记录一下编辑这条任务的title，方便在取消编辑的时候重新给之前的title
			this.beforeTitle = todo.title;

			this.edtorTodos=todo;
		},
		edtorTodoed(todo){		//编辑任务成功
			this.edtorTodos="";//edtorTodo为空后，动态class:edting为false
		},
		cancelTodo(todo){	//Esc取消编辑任务
			todo.title = this.beforeTitle;

			this.beforeTitle = '';

			//让div显示出来，input隐藏
			this.edtorTodos = '';
		}
	},
	directives:{		//焦点
		"foucs":{		
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
})
function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;	
}

watchHashChange();

window.addEventListener("hashchange",watchHashChange);