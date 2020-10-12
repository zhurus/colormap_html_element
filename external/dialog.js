(function(){
    class Dialog {
		constructor(id) {
			this.submitHandlers = [];
			this.nodeJQ = $(`#${id}`);
			this.nodeJQ.dialog({
				autoOpen: true,
				closeOnEscape: true,
				modal: true,
				closeText: "",
				width: 'auto',
				buttons: [
					{
						text: "Ok",
						click: this.submit.bind(this)
					},
					{
						text: "Cancel",
						click: this.cancel.bind(this)
					}
				],
				close: ()=>{
					this.submitHandlers = [];
					this.reset();
				},
				position: { my: "center", at: "center", of: window}
			});
			this.nodeJQ.removeClass("hidden");
		}
		show() {
			this.nodeJQ.dialog("open");
		}
		hide() {
			this.nodeJQ.dialog("close");
		}
		cancel() {
			this.submitHandlers = [];
			this.nodeJQ.dialog("close");
		}
		setTitle(title) {
			this.nodeJQ.dialog("option", "title", title);
		}
		submit() {
			try{
				this.submitHandlers.forEach(h => h.call(null));
				this.submitHandlers = [];
				this.hide();
				this.reset();
			} catch(error) {
				objects.showError(error);
			};
		}
		addSubmitHandler(handler) {
			this.submitHandlers.push(handler);
		}
	}
    objects.Dialog = Dialog;
})()