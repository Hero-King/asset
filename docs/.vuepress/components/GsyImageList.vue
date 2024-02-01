<template>
  <el-table :data="files" style="width: 100%">
    <el-table-column align="center" prop="module" label="模块" width="180"> </el-table-column>
    <el-table-column align="center" prop="img" label="截图" width="300">
      <template slot-scope="scope">
        <el-image
          fit="contain"
          style="height: 150px"
          :src="$withBase('/img/gsyApp/' + scope.row.img)"
          :preview-src-list="[$withBase('/img/gsyApp/' + scope.row.img)]"
        >
        </el-image>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    dir: String
  },
  data() {
    return {
      files: []
    }
  },
  mounted() {
    // 在页面加载后获取文件列表
    this.getFiles()
  },
  methods: {
    getFiles() {
      // 获取目录中的文件列表
      // 这里需要使用webpack的require.context方法
      const ctx = require.context('../public/img/gsyApp', true, /\.png$/)
      const files = ctx.keys().map((i) => i.substring(2))

      this.files = files.map((i) => ({
        module: i.replace('.png', ''),
        img: i
      }))
    }
  }
}
</script>
