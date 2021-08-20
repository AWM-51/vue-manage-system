<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 任务列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="addTask"
                >添加任务</el-button>
                <el-select v-model="query.type" placeholder="任务类型" class="handle-select mr10">
                    <el-option key="0" label="个人待办" value="0"></el-option>
                    <el-option key="1" label="家庭作业" value="1"></el-option>
                    <el-option key="2" label="平时测验" value="2"></el-option>
                    <el-option key="3" label="期中考试" value="3"></el-option>
                    <el-option key="4" label="期末考试" value="4"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="任务名称名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="handleClean">重置</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
                <el-table-column prop="name" label="任务名">
                </el-table-column>
                <el-table-column prop="type" width="80" label="任务类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==='0'">个人待办</span>
                        <span v-if="scope.row.type==='1'">家庭作业</span>
                        <span v-if="scope.row.type==='2'">平时测验</span>
                        <span v-if="scope.row.type==='3'">期中考试</span>  
                        <span v-if="scope.row.type==='4'">期末考试</span> 
                    </template>
                </el-table-column>              
                <el-table-column prop="bak" label="任务描述" align="center">      
                </el-table-column>
                <el-table-column prop="deadLine" label="任务截止时间">
                </el-table-column>
                <el-table-column prop="createrName" width="60" label="创建人">

                </el-table-column>
                <el-table-column prop="updateTime" label="操作时间">

                </el-table-column>
                <el-table-column label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag
                            :type='buttonTagType(scope.row.status)'
                        >
                        <span v-if="scope.row.status==='0'">待处理</span>
                        <span v-if="scope.row.status==='1'">已完成</span>
                        <span v-if="scope.row.status==='2'">延迟处理</span>
                        <span v-if="scope.row.status==='3'">已过期</span>
                        </el-tag>
                    </template>
                </el-table-column>

                
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus"
                            @click="chosePushObject(scope.row)"
                        >下发</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 下发弹出框 -->
        <el-dialog title="下发" :visible.sync="pushVisible" width="50%">
            <div class="block">
                <span class="demonstration">选择下发对象：</span>
                <el-cascader
                    v-model="objectIdList"
                    :options="OGoptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"></el-cascader>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="pushTask">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { taskList,taskDelete,pushTask } from '@/api/task';
import { getOrginazation } from '@/api/sgc';
export default {
    name: 'tasktable',
    data() {
        return {
            query: {
                name: null,
                type: null,
                status: null,
                deadLine:null,
                pageSize: 10,
                offset:0
            },
            pushParam:{
                objectId: null,
                taskid: null,
                taskType: null,
                objectType: null,
                deadline: null
            },
            objectIdList:[],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pushVisible: false,
            total: 0,
            form: {},
            idx: -1,
            id: -1,
            OGoptions:[]
        };
    },
    //创建的时候
    created() {
        this.getData();
    },
    //activated()：在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等
    activated(){
        this.getData();
    },
    methods: {
        // 获取 tasklists 数据
        getData() {
            taskList(this.query).then(res => {
                console.log(res);
                this.tableData = res.data;
                this.total = res.total;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.$set(this.query, 'offset', 0);
            this.$set(this.query, 'pageSize', 10);
            this.getData();
        },
        // 触发搜索按钮
        handleChange() {
            this.$set(this.pushParam, 'objectId', this.objectIdList[this.objectIdList.length - 1]);
            this.$set(this.pushParam, 'objectType', '1');
            console.log(this.pushParam);
        },
        //重置筛选条件
        handleClean(){
            this.$set(this.query, 'pageIndex', 1);
            this.$set(this.query, 'offset', 0);
            this.$set(this.query, 'pageSize', 10);
            this.$set(this.query, 'name', null);
            this.$set(this.query, 'type', null);
            this.$set(this.query, 'status', null);
            this.$set(this.query, 'deadLine', null);
            this.getData();
        },
        //跳转到下发选择
        chosePushObject(row){
            this.getOGData();
            this.pushVisible=true;
            this.$set(this.pushParam, 'taskid', row.id);
            this.$set(this.pushParam, 'taskType', row.type);
            this.$set(this.pushParam, 'deadline', row.deadline);
            console.log(this.pushParam.taskId);
        },
        //下发任务
        pushTask(){
            this.pushVisible=false;
            pushTask(this.pushParam).then(result =>{
                if(result.code==1){
                    this.$message.success("下发成功");
                }
                else{
                    this.$message.success('下发失败');
                }
            });
            
        },
        // 删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const list=[] ;
                    list.push(row.id);
                    taskDelete(list).then(res =>{
                        if(res.code==1){
                            this.$message.success('删除成功');
                        }
                        else{
                            this.$message.success('删除失败');
                        }
                        this.getData();
                    });
                    
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //获取组织架构数据
        getOGData(){
            const data='-1';
            getOrginazation(data).then(res =>{
                if(res.code==1){
                    this.OGoptions=res.data;
                }
                else{
                    console.error(res.message);
                }
            });
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        addTask() {
            // this.$router.replace('/taskAddForm')
            this.$router.push({path:'/taskAddForm'})
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'offset', (val-1)*10);
            this.getData();
        }
        ,
        //状态颜色控制
        buttonTagType(status){
            if(status===0){
                return 'success';
            }
            else if(status===1){
                return 'info';
            }
            else if(status===2){
                return 'warning';
            }
            else if(status===3){
                return 'danger';
            }

        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
