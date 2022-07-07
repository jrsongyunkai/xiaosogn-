<template>
  <div>
    <div class="allNews">
      <div>
        <h3>消息</h3>
        <p
          @click="handelSelected(0)"
          :class="params.msgType === '' ? 'blue' : 'white'"
        >
          所有消息
        </p>
        <p
          @click="handelSelected(1)"
          :class="params.msgType === 1 ? 'blue' : 'white'"
        >
          系统公告
        </p>
      </div>
    </div>
    <div class="search">
      <span
        style="font-size: 14px; cursor: pointer; margin-left: 20px"
        @click="back"
        >返回</span
      ><span style="font-size: 14px; margin-left: 3px">>&nbsp;消息</span>
      <Button
        @click="reset"
        style="
          color: #fff;
          margin-left: 10px;
          float: right;
          margin-right: 20px;
          margin-top: 13px;
        "
        >重置</Button
      >
      <Button
        type="primary"
        @click="changestate(model1)"
        style="
          background: #007eff;
          border: none;
          margin-left: 10px;
          float: right;
          margin-top: 13px;
        "
        >查询</Button
      >
      <Select
        v-model="model1"
        style="width: 260px; margin-left: 10px; float: right; margin-top: 13px"
      >
        <Option
          v-for="item in cityList1"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </div>
    <main>
      <List
        v-for="(item, index) in tableData"
        :key="item.id"
        :border="tableData.length !== 0 ? true : false"
        class="list"
      >
        <div
          @click.stop="handleClick(item)"
          class="light"
          v-if="tableData.length !== 0"
        >
          <p v-show="!item.isRead"></p>
          <ListItem>
            <ListItemMeta :title="item.title" :description="item.content" />
            <template slot="action">
              <li>
                <span>{{ item.createTime }}</span>

                <Button
                  type="text"
                  @click="deletes(item, index)"
                  style="color: #f24e4c"
                >
                  删除
                </Button>
              </li>
            </template>
          </ListItem>
        </div>
      </List>
      <div class="nodata" v-if="tableData.length === 0">暂无数据</div>
      <div class="btn">
        <Select
          style="width: 100px"
          @on-change="changepagenum"
          placeholder="10条/页"
        >
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        &nbsp;<Button @click="handlecurrentPage('home')">首页</Button>&nbsp;
        <Button :disabled="currentPage === 1" @click="handlecurrentPage('prev')"
          >上一页</Button
        >&nbsp;
        <Button
          @click="handlecurrentPage('next')"
          :disabled="tableData.length !== params.pageSize"
          >下一页</Button
        >&nbsp;
      </div>
    </main>
  </div>
</template>

<script>
    import { pageInfoById, delNewsStatus, updateReadStatus } from '@/api/public';
    export default {
        data () {
            return {
                tableData: [],
                lastId: '',
                currentPage: 1,
                params: {
                    msgId: '',
                    isRead: '',
                    msgType: '',
                    pageSize: 10
                },
                cityList: [
                    {
                        value: 10,
                        label: '10条/页'
                    },
                    {
                        value: 20,
                        label: '20条/页'
                    },
                    {
                        value: 50,
                        label: '50条/页'
                    }
                ],
                cityList1: [
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未读'
                    },
                    {
                        value: 1,
                        label: '已读'
                    }
                ],
                model1: '',
                pageData: []
            };
        },
        methods: {
            init () {
                this.getlistData();
            },
            getlistData () {
                pageInfoById(this.params).then((res) => {
                    if (res.success) {
                        this.tableData = res.data;
                        this.lastId = res.lastId;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            deletes (item, index) {
                let parmas = {
                    careId: item.careId
                };
                delNewsStatus(parmas).then((res) => {
                    if (res.success) {
                        this.$Message.success(res.message);
                        this.tableData.splice(index, 1);
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            handleClick (row) {
                if (row.isRead === 1) {
                    return false;
                }
                updateReadStatus({ careId: row.careId }).then((res) => {
                    if (res.success) {
                        this.$Message.success(res.message);
                        row.isRead = 1;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            changepagenum (e) {
                this.params.pageSize = e;
                this.getlistData();
            },
            handlecurrentPage (e) {
                if (e === 'home') {
                    this.currentPage = 1;
                    this.pageData = [];
                    this.params.msgId = '';
                } else if (e === 'prev') {
                    if (this.currentPage !== 1) {
                        this.currentPage -= 1;
                        this.pageData.pop();
                        this.params.msgId = this.pageData[this.pageData.length - 1];
                    } else {
                        return false;
                    }
                } else if (e === 'next') {
                    this.currentPage += 1;
                    this.pageData.push(this.lastId);
                    this.params.msgId = this.lastId;
                }
                this.getlistData();
            },
            changestate (e) {
                this.params.isRead = e;
                this.getlistData();
            },
            handelSelected (index) {
                this.params.msgType = index === 0 ? '' : 1;
                this.handlecurrentPage('home');
            },
            back () {
                this.$router.go(-1);
            },
            reset () {
                this.model1 = '';
                this.params = {
                    msgId: '',
                    isRead: '',
                    msgType: '',
                    pageSize: 10
                };
                this.currentPage = 1;
                this.lastId = '';
                this.getlistData();
            }
        },
        mounted () {
            this.init();
        }
    };
</script>

<style lang="less" scoped>
.ivu-theme-dark .ivu-list-item-action > li,
.ivu-theme-dark .ivu-list-item-meta-description {
  color: #999 !important;
}
.allNews {
  float: left;
  margin-right: 10px;
  margin-left: 20px;
  span {
    color: #fff;
  }
  div {
    width: 244px;
    height: 220px;
    margin-top: 10px;
    background-color: #1a202e;
    h3 {
      height: 58px;
      line-height: 58px;
      font-weight: Regular;
      font-family: PingFangSC-Regular;
      padding-left: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
  p {
    cursor: pointer;
    font-size: 14px;
    height: 56px;
    padding-left: 20px;
    line-height: 56px;
    font-weight: Regular;
    font-family: PingFangSC-Regular;
  }
  .blue {
    color: #007eff;
    background-color: rgba(88, 94, 110, 0.2);
  }
  .white {
    color: #585e6e;
  }
}
.search {
  width: 85%;
  background-color: #1a202e;
  float: left;
  height: 58px;
  line-height: 58px;
  margin-top: 10px;
  margin-right: 10px;
  span {
    margin-left: 70px;
  }
}
main {
  width: 85%;
  float: left;
  margin-right: 10px;

  margin-bottom: 100px;
  .list:hover {
    background-color: rgba(88, 94, 110, 0.5);
  }
  p {
    // float: left;
    position: relative;
    left: 12px;
    top: 27px;
    width: 6px;
    height: 6px;
    background-color: #409eff;
    border-radius: 50%;
    // margin: 20px;
    // margin-left: 50px;
  }
  .btn {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 100px;
  }
  .nodata {
    height: 40px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
  }
  .list {
    background-color: #1a202e;
    margin-top: 10px;
    border: none;
    border-radius: 0;
  }
}
</style>
