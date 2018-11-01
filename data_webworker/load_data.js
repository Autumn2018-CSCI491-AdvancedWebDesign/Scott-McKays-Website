/* Author:......... Scott McKay
 * Date:........... Wednesday, October 31st, 2018
 * Institution:.... University of Montana
 * Class:.......... Advanced Web-design & Programming
*/

$('#loadData').on('click', function()
{
  $.getJSON("shows.json", function(json)
  {
      console.log(json); // this will show the info it in firebug console
      document.getElementById("result").innerHTML = JSON.stringify(json);
  });
});
