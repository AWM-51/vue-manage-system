<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 任务
                </el-breadcrumb-item>
                <el-breadcrumb-item>任务添加</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="任务名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option key="grdb" label="个人待办" value="0"></el-option>
                            <el-option key="jtzy" label="家庭作业" value="1"></el-option>
                            <el-option key="pscy" label="平时测验" value="2"></el-option>
                            <el-option key="qzks" label="期中考试" value="3"></el-option>
                            <el-option key="qmks" label="期末考试" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="完成时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.deadLine"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <!-- <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                placeholder="选择时间"
                                v-model="form.date2"
                                style="width: 100%;"
                            ></el-time-picker>
                        </el-col> -->
                    </el-form-item>
                    <!-- <el-form-item label="班级选择">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item> -->
                    <!-- <el-form-item label="选择开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item> -->
                    <!-- <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="步步高" name="type"></el-checkbox>
                            <el-checkbox label="小天才" name="type"></el-checkbox>
                            <el-checkbox label="imoo" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="详细信息">
                        <el-input type="textarea" rows="5" v-model="form.bak"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button @click="cancelForm">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {addTaskPost} from '@/api/task'
export default {
    name: 'addTaskForm',
    data() {
        return {
            options: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            form: {
                name: '',
                type: '',
                deadLine: '',
                bak: ''
                // delivery: true,
                // type: ['步步高'],
                // resource: '小天才',
                // desc: '',
                // options: []
            }
        };
    },
    methods: {
        onSubmit() {
            if(this.form.name==""||this.form.type==""||this.form.date==""){
                this.$message.error("请输入名称或者类型或者完成时间！");
            }
            else{
                addTaskPost(this.form).then((resp)=>{
                    if(resp.code==1){
                        this.$message.success("提交成功");
                        this.$router.go(-1);
                    }
                    else{
                        this.$message.error("提交失败");
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }
        },
        cancelForm(){
            this.$router.go(-1);
        }
    }
};
</script>