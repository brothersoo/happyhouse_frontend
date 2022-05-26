<template>
    <b-card no-body>
        <b-card-header class="border-0">
            <h3 class="mb-0">아파트 매매 거래목록</h3>
        </b-card-header>

        <el-table class="table-responsive table" 
                header-row-class-name="thead-light" v-if="deals && deals.length != 0"
                :data="deals">
            <el-table-column label="아파트명"
                            min-width="170px"
                            prop="house.aptName">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.house.aptName}}</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>

            <el-table-column label="층"
                            prop="floor"
                            min-width="140px">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.floor}}층</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>

            <el-table-column label="전용면적"
                            prop="exclusivePrivateArea"
                            min-width="140px">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.exclusivePrivateArea}}㎡</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>

            <el-table-column label="매매가(만원)"
                            min-width="170px"
                            prop="price">
                <template v-slot="{row}">
                    <b-media no-body class="align-items-center">
                        <b-media-body>
                            <span class="font-weight-600 name mb-0 text-sm">{{row.price | moneyPoint()}}만</span>
                        </b-media-body>
                    </b-media>
                </template>
            </el-table-column>

            <el-table-column label="거래일(최신순)"
                            min-width="170px"
                            prop="dealDate">
            </el-table-column>

            
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>

    </b-card>
</template>

<script>
import { mapState } from "vuex";
import { Table, TableColumn} from 'element-ui';

export default {
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    computed: {
        ...mapState(["deals"]),
    },
    data() {
        return {
            currentPage: 1
        };
    },
    filters: {
        moneyPoint: function(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}
</script>
