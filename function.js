function change()
{
    var productLink = document.getElementById("productLink").value;
    if(productLink == "")
    {
        document.getElementById("thongbaoLink").innerHTML = "Vui lòng điền link.";
    }
    else
    {
        var posOfTemp = productLink.indexOf(".html?");
        if(posOfTemp == -1)
        {
            document.getElementById("thongbaoLink").innerHTML = "Link chưa hợp lý";
        }
        else
        {
            document.getElementById("thongbaoLink").innerHTML = "";
            document.getElementById("thongbaoAPI").innerHTML = "";
            productLink = productLink.substring(0, posOfTemp);
            var posOfSKUId = productLink.lastIndexOf("-s") + 2;
            var SKUId = productLink.substring(posOfSKUId);
            var itemId = productLink.substring(productLink.lastIndexOf("i") + 1, posOfSKUId - 2);
            var finalLink = "https://www.lazada.vn/wow/gcp/vn/trade/shipping?spm=a2o4n.pdp_revamp.main_page.bottom_bar_main_button&buyParams=%7B%22items%22%3A%5B%7B%22itemId%22%3A%22" + itemId + "%22%2C%22skuId%22%3A%22" + SKUId + "%22%2C%22quantity%22%3A1%2C%22attributes%22%3Anull%7D%5D%7D&from_pdp_buy_now=1&pwa_true_login=1";
            var APILink = "https://my.lazada.vn/wishlist/api/addItem?itemId=" + itemId + "&skuId=" + SKUId;
            document.getElementById("finalLink").value = finalLink;
            document.getElementById("APILink").value = APILink;
            document.getElementById("hrefLink").setAttribute("href", finalLink);

        }

    }
}

function copyLink()
{
    let textarea = document.getElementById("finalLink");
    if(textarea.value == "")
    {
        document.getElementById("thongbaoLink").innerHTML = "Chưa có link copy làm chi :v";
    }
    else
    {
        textarea.select();
        document.execCommand("copy");
        document.getElementById("thongbaoLink").innerHTML = "Đã copy!!!";
    }
}
function copyAPI()
{
    let textarea = document.getElementById("APILink");
    if(textarea.value == "")
    {
        document.getElementById("thongbaoAPI").innerHTML = "Chưa có link copy làm chi :v";
    }
    else
    {
        textarea.select();
        document.execCommand("copy");
        document.getElementById("thongbaoAPI").innerHTML = "Đã copy!!!";
    }
}
function reset()
  {
      document.getElementById("productLink").value = "";
      document.getElementById("finalLink").value = "";
      document.getElementById("APILink").innerHTML = "";
      document.getElementById("hrefLink").href = "#";
      document.getElementById("thongbaoLink").innerHTML = "";
      document.getElementById("thongbaoAPI").innerHTML = "";
  }