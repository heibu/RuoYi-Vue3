// 腾讯云对象存储
import COS from 'cos-js-sdk-v5'
// getCosSign是向后台请求的接口，传参依照情况而定。一般后台会返回密钥等相关信息
import {getCosSign} from '@/api/tool/cos';
const proxy = getCurrentInstance()

var config = {
  Bucket: 'sqtcoa-1252375533',
  Region: 'ap-beijing',
  Baseurl: 'https://sqtcoa-1252375533.cos.ap-beijing.myqcloud.com/',
  Key:'workflow-attachment/'
};
export function cosUpload(file, callback) {
  getCosSign({
    Bucket: config.Bucket, // 存储桶名称
    Region: config.Region // 地区
  }).then(response => { // 后台接口返回 密钥相关信息
    // console.log(file)
    if (response) {
      const resData = response
      const credentials = resData.credentials;
      let timestamp = Date.parse(new Date())

      var cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            StartTime: resData.startTime,
            ExpiredTime: resData.expiredTime,
            expiration: resData.expiration,
            requestId: resData.requestId
          })
        }
      })
      cos.putObject({// 此处用了最简单的上传函数，此外，腾讯云还支持分片上传函数等等。
          Bucket: config.Bucket, // 存储桶名称
          Region: config.Region, // 地区
          Key: config.Key+timestamp+"-"+file.name, // 图片名称
          StorageClass: 'STANDARD',
          Body: file.raw||file, // 上传文件对象
          onHashProgress: function (progressData) {
            console.log('校验中', JSON.stringify(progressData));
          },
          onProgress: function (progressData) {
            console.log('上传中', JSON.stringify(progressData));
        },
          
      },function (err, data) {// 此处的两个传参是腾讯云返回的，data与上面的data不一样。直接照着写就可以。
        console.log(err)
      // 这里的data如果是个带有Location等的对象，则说明上传成功。
        if (err) {
          proxy.$message.error('文件上传失败,请重新上传')
        } else {
          // console.log("上传后返回的data:")
          // console.log(data)
          callback(data)
        }
      }

    )}
   
  })
}
export function cosSingleDel(filekey) {
  getCosSign({
    Bucket: config.Bucket, // 存储桶名称
    Region: config.Region // 地区
  }).then(response => { // 后台接口返回 密钥相关信息
    if (response) {
      const resData = response
      const credentials = resData.credentials;
      var cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            StartTime: resData.startTime,
            ExpiredTime: resData.expiredTime,
            expiration: resData.expiration,
            requestId: resData.requestId
          })
        }
      })
      cos.deleteObject({
        Bucket: config.Bucket,
        Region: config.Region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: config.Key+filekey,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
      }, function(err, data) {
          console.log(err || data);
      });
    }
   
  })
}

