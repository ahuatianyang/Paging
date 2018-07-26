Vue.component('tabs',{
	template: '\
		<div class="tabs"> \
			<div class="tabs-bar"> \
				<div \
					:class="tabCls(item)" \
					v-for="(item,index) in navList" \
					v-if="item.showPane"  \
					@click="handleChange(index)"> \
					{{ item.label }} \
					<button  \
					v-if="item.closable"  \
					@click.stop="handleDel(item,index)">X</button>  \
				</div> \
			</div> \
			<div class="tabs-content"> \
				<slot></slot> \
			</div> \
		</div>',
	props:{
		value: {
			type: [String, Number]
		}
	},
	data: function(){
		return {
			currentValue: this.value,
			navList:[]
		}
	},
	methods: {
		tabCls: function(item){
			return [
				'tabs-tab',
				{
					'tabs-tab-active': item.name === this.currentValue
				}
			]
		},
		getTabs (){
			return this.$children.filter(function(item){
				return item.$options.name === 'pane';
			});
		},
		updateNav(){
			this.navList = [];
			var _this = this;
			
			this.getTabs().forEach(function(pane,index){
				_this.navList.push({
					label: pane.label,
					name: pane.name || index,
					closable: pane.closable,
					showPane: pane.showPane
				});
				
				if(!pane.name) pane.name = index;
				if(index === 0){
					if(!_this.currentValue){
						_this.currentValue = pane.name || index;
					}
				}
			});
			
			this.updateStatus();
		},
		updateStatus(){
			var tabs = this.getTabs();
			var _this = this;
			
			tabs.forEach(function (tab){
				return tab.show = tab.name === _this.currentValue;
			})
		},
		handleChange: function(index){
				var nav = this.navList[index];
				var name = nav.name;
				this.currentValue = name;
				this.$emit('input',name);
				this.$emit('onclick',name);
		},
		handleDel: function(item,index){
				item.showPane = false; 
				var tabs = this.getTabs();
				tabs.forEach(function (tab){
					if(tab.name === item.name){
						tab.show = false;
					}
				})
		}
	},
	watch:{
		value: function(val){
			this.currentValue = val;
		},
		currentValue: function(){
			this.updateStatus();
		}
	}
})