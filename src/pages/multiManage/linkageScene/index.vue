<template>
  <div class="linkageScene">
    <div class="linkageScene-head">
      <Button type="text"><Icon type="md-add" />新增联动</Button>
    </div>
    <div class="linkageScene-content">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{  }" slot="action">
          <Button type="text" size="small" style="margin-right: 5px"
            >编辑</Button
          >
          <Button type="text" size="small">停启</Button>
          <Button type="text" size="small">删除</Button>
        </template>
      </Table>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'multiManage-linkageScene',
        data () {
            return {
                columns: [
                    {
                        title: '联动名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                data: [
                    {
                        name: '测试',
                        state: '启用',
                        remarks: 'CNNo1'
                    }
                ]
            };
        }
    };
</script>
<style lang="less" scoped>
.linkageScene {
  .linkageScene-head {
    Button {
      margin: 0 5px;
      background: none;
      &:hover {
        background: none;
      }
    }
  }
}
</style>
