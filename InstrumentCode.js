goog.module('instrument.code');

/**
 * @type {!Map<String,number>}
 */
let report = new Map();

  /**
   * The instrumentCode function which is the instrumentation functon that will
   * be called during program execution. It gathers all the data in the
   * reportData variable defined above.
   */
  function instrumentCode() {

	if(ist_arr.length > 10000) {

		let fixed_length = ist_arr.length;
		for (var i = 0 ; i < fixed_length ; ++i){
		  let param = ist_arr[i];
		  if(report.has(param)){
			report.set(param,report.get(param) + 1);
		  }else{
			report.set(param, 1);
		  }
		}
		ist_arr.length = 0;

		const reportJson = {};

		report.forEach((value, key) => {
		  reportJson[key] = {frequency: value};
		})

		download(JSON.stringify(reportJson), 'test','json');
		console.log(JSON.stringify(reportJson));
	}
  }
  
  function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

window.setInterval(() => {instrumentCode()}, 500);
