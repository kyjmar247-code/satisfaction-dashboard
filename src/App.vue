<template>
  <div id="app">
    <div class="dashboard-layout">
      <!-- 좌측 사이드바: 그룹 안내표 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h2 class="sidebar-title">권역·그룹 안내</h2>
          
          <!-- 지점 검색 -->
          <div class="location-search">
            <input
              v-model="locationSearchQuery"
              type="text"
              placeholder="지점명 검색..."
              class="location-search-input"
            />
            <div v-if="locationSearchResult" class="location-search-result">
              <div 
                class="search-result-item" 
                @click="selectLocationFromSearch(locationSearchResult)"
                style="cursor: pointer;"
              >
                <strong>{{ locationSearchResult.location }}</strong>
                <div class="search-result-info">
                  <span class="result-badge result-region">{{ locationSearchResult.region }}</span>
                  <span class="result-badge result-group">그룹 {{ locationSearchResult.group }}</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-top: 4px;">
                  클릭하여 필터 적용
                </div>
              </div>
            </div>
            <div v-else-if="locationSearchQuery && locationSearchQuery.length > 0" class="location-search-no-result">
              검색 결과가 없습니다.
            </div>
          </div>

          <div class="region-groups">
            <div v-for="regionInfo in regionGroupInfo" :key="regionInfo.region" class="region-section">
              <div class="region-header">{{ regionInfo.region }}</div>
              <div v-for="group in regionInfo.groups" :key="group.group" class="group-item">
                <div class="group-header">
                  <span class="group-number">그룹 {{ group.group }}</span>
                  <span class="location-count">({{ group.locations.length }}개 지점)</span>
                </div>
                <div class="location-list">
                  <span 
                    v-for="(location, idx) in group.locations" 
                    :key="location" 
                    class="location-tag"
                    :class="{ 'location-highlight': locationSearchQuery && location.includes(locationSearchQuery) }"
                  >
                    {{ location }}<span v-if="idx < group.locations.length - 1">, </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측 메인 콘텐츠 -->
      <div class="main-content">
        <div class="container">
          <div class="page-header">
            <h1 class="page-title">2025 하반기 재원생 만족도 조사 대시보드</h1>
            <button @click="handlePrint" class="print-button" title="프린트">
              🖨️ 프린트
            </button>
          </div>

          <!-- 필터 섹션 -->
          <div class="card">
            <div class="filters">
              <div class="filter-group">
                <label class="filter-label">권역</label>
                <select v-model="filters.region" @change="onFilterChange" class="filter-select">
                  <option value="전체">전체</option>
                  <option v-for="region in availableRegions" :key="region" :value="region">
                    {{ region }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">그룹</label>
                <select v-model="filters.group" @change="onFilterChange" class="filter-select">
                  <option value="전체">전체</option>
                  <option v-for="group in availableGroups" :key="group" :value="group">
                    {{ group }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">지점</label>
                <select v-model="filters.location" @change="onFilterChange" class="filter-select">
                  <option value="전체">전체</option>
                  <option v-for="location in availableLocations" :key="location" :value="location">
                    {{ location }}
                  </option>
                </select>
              </div>
            </div>
            <!-- 프린트용 필터 정보 표시 -->
            <div class="print-filter-info">
              <strong>선택된 필터:</strong> 
              권역: {{ filters.region }}, 
              그룹: {{ filters.group }}, 
              지점: {{ filters.location }}
            </div>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">데이터를 불러오는 중...</p>
          </div>

          <!-- 학년 구분 & 입학시기 차트 섹션 -->
          <div v-show="!loading" class="card">
            <!-- 학년 구분 파이 차트 -->
            <div class="charts-section">
              <h3 class="chart-subtitle">학년 구분</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="gradeOverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="gradeRegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="gradeGroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="gradeLocationChart"></canvas>
                </div>
              </div>
            </div>

              <!-- 입학시기 막대 그래프 -->
            <div class="charts-section" style="margin-top: 40px;">
              <h3 class="chart-subtitle">입학시기</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="enrollmentOverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="enrollmentRegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="enrollmentGroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="enrollmentLocationChart"></canvas>
                </div>
              </div>
            </div>

            <!-- 자기주도학습 선택 이유 막대 그래프 -->
            <div class="charts-section" style="margin-top: 40px;">
              <h3 class="chart-subtitle">자기주도학습 선택 이유</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="selfstudyOverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="selfstudyRegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="selfstudyGroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="selfstudyLocationChart"></canvas>
                </div>
              </div>
            </div>

            <!-- 이투스247학원 선택 이유 막대 그래프 -->
            <div class="charts-section" style="margin-top: 40px;">
              <h3 class="chart-subtitle">이투스247학원 선택 이유</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="etosOverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="etosRegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="etosGroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="etosLocationChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- 선택/경로 관련 분포 (A5~A8) -->
          <div v-show="!loading" class="card">
            <div class="charts-section">
              <h3 class="chart-subtitle">학원 등록 전, 공부한 곳</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="a5OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="a5RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="a5GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="a5LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">학원 선택 시, 고려했던 학원이나 독서실(스터디카페)</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="a6OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="a6RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="a6GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="a6LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">인지 경로</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="a7OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="a7RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="a7GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="a7LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">정보탐색 경로</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="a8OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="a8RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="a8GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="a8LocationChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- 만족/상담/보강 관련 분포 (B2~C5) -->
          <div v-show="!loading" class="card">
            <div class="charts-section">
              <h3 class="chart-subtitle">학습관리 만족 사항</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="b2OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="b2RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="b2GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="b2LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">생활관리 만족 사항</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="b5OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="b5RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="b5GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="b5LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">입시관리 만족 사항</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="b7OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="b7RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="b7GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="b7LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">상담 만족 사항</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="b9OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="b9RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="b9GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="b9LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">희망 상담 주기 및 횟수</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="b10OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="b10RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="b10GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="b10LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">전체 만족 사항</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="c4OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="c4RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="c4GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="c4LocationChart"></canvas>
                </div>
              </div>
            </div>

            <div class="charts-section">
              <h3 class="chart-subtitle">보강점</h3>
              <div class="charts-grid">
                <div class="chart-container">
                  <h4 class="chart-label">전체</h4>
                  <canvas ref="c5OverallChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">권역</h4>
                  <canvas ref="c5RegionChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">그룹</h4>
                  <canvas ref="c5GroupChart"></canvas>
                </div>
                <div class="chart-container">
                  <h4 class="chart-label">지점</h4>
                  <canvas ref="c5LocationChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- 주관식 답변 섹션 -->
          <div v-show="!loading" class="card">
            <h2 class="card-title">불만족 주관식 답변</h2>

            <div class="search-box">
              <select v-model="unsatisfiedFilter.question" class="filter-select" style="min-width: 250px;">
                <option value="전체">전체 문항</option>
                <option v-for="q in availableQuestions" :key="q.code" :value="q.code">
                  {{ q.name }}
                </option>
              </select>
              <input
                v-model="unsatisfiedFilter.keyword"
                type="text"
                placeholder="키워드 검색..."
                class="search-input"
                @input="onUnsatisfiedFilterChange"
              />
            </div>
              <div v-if="!loading && rawData.length === 0" class="no-data">
                데이터를 불러올 수 없습니다.<br>
                CSV 파일 경로를 확인하세요.<br>
              <small style="color: #999;">F12 키를 눌러 콘솔에서 상세 에러를 확인할 수 있습니다.</small>
            </div>
        <div v-else-if="allFilteredResponses.length === 0" class="no-data">
          조건에 맞는 응답이 없습니다.
        </div>
            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>지점</th>
                    <th>응시자</th>
                    <th>학년</th>
                    <th>문항</th>
                    <th>만족도</th>
                    <th>주관식 답변</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(response, index) in allFilteredResponses" :key="index" class="response-row">
                    <td>{{ response.location }}</td>
                    <td>{{ maskName(response.respondent) }}</td>
                    <td>{{ response.grade }}</td>
                    <td>{{ response.questionName }}</td>
                    <td>
                      <span v-if="response.isUnsatisfied !== undefined" :class="response.isUnsatisfied ? 'badge badge-unsatisfied' : 'badge badge-satisfied'">
                        {{ formatSatisfactionScore(response.score, response.questionCode) }}
                      </span>
                      <span v-else>{{ formatSatisfactionScore(response.score, response.questionCode) }}</span>
                    </td>
                    <td>{{ filterProfanity(response.textResponse) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PieController,
  DoughnutController
} from 'chart.js'
import { loadData, processData } from './utils/dataLoader.js'
import { calculateMetrics, filterByHierarchy } from './utils/metrics.js'

// Chart.js 등록 (필요한 모든 요소 등록)
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PieController,
  DoughnutController
)

// 데이터
const rawData = ref([])
const questionMetadata = ref([])
const loading = ref(true)

// 필터
const filters = ref({
  region: '전체',
  group: '전체',
  location: '전체'
})

const unsatisfiedFilter = ref({
  question: '전체',
  keyword: ''
})

// 지점 검색
const locationSearchQuery = ref('')

// 지점 검색 결과
const locationSearchResult = computed(() => {
  if (!locationSearchQuery.value || locationSearchQuery.value.trim() === '') {
    return null
  }
  
  const query = locationSearchQuery.value.trim()
  
  // processedData에서 검색
  for (const row of processedData.value) {
    if (row.location && row.location.includes(query)) {
      return {
        location: row.location,
        region: row.region || '미상',
        group: row.group || '미상'
      }
    }
  }
  
  return null
})

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 20

// 차트 참조
const gradeOverallChart = ref(null)
const gradeRegionChart = ref(null)
const gradeGroupChart = ref(null)
const gradeLocationChart = ref(null)
const enrollmentOverallChart = ref(null)
const enrollmentRegionChart = ref(null)
const enrollmentGroupChart = ref(null)
const enrollmentLocationChart = ref(null)
const selfstudyOverallChart = ref(null)
const selfstudyRegionChart = ref(null)
const selfstudyGroupChart = ref(null)
const selfstudyLocationChart = ref(null)
const etosOverallChart = ref(null)
const etosRegionChart = ref(null)
const etosGroupChart = ref(null)
const etosLocationChart = ref(null)

// 추가 선택/만족/보강 문항 차트 (전체/권역/그룹/지점)
// A5
const a5OverallChart = ref(null)   // 학원 등록 전, 공부한 곳 (S1 Q5) - 전체
const a5RegionChart = ref(null)    // 권역
const a5GroupChart = ref(null)     // 그룹
const a5LocationChart = ref(null)  // 지점
// A6
const a6OverallChart = ref(null)   // 학원 선택 시, 고려했던 곳 (S1 Q6)
const a6RegionChart = ref(null)
const a6GroupChart = ref(null)
const a6LocationChart = ref(null)
// A7
const a7OverallChart = ref(null)   // 인지 경로 (S1 Q9)
const a7RegionChart = ref(null)
const a7GroupChart = ref(null)
const a7LocationChart = ref(null)
// A8
const a8OverallChart = ref(null)   // 정보탐색 경로 (S1 Q8)
const a8RegionChart = ref(null)
const a8GroupChart = ref(null)
const a8LocationChart = ref(null)
// B2
const b2OverallChart = ref(null)   // 학습관리 만족 사항 (S2 Q2)
const b2RegionChart = ref(null)
const b2GroupChart = ref(null)
const b2LocationChart = ref(null)
// B5
const b5OverallChart = ref(null)   // 생활관리 만족 사항 (S2 Q5)
const b5RegionChart = ref(null)
const b5GroupChart = ref(null)
const b5LocationChart = ref(null)
// B7
const b7OverallChart = ref(null)   // 입시관리 만족 사항 (S2 Q7)
const b7RegionChart = ref(null)
const b7GroupChart = ref(null)
const b7LocationChart = ref(null)
// B9
const b9OverallChart = ref(null)   // 상담 만족 사항 (S2 Q9)
const b9RegionChart = ref(null)
const b9GroupChart = ref(null)
const b9LocationChart = ref(null)
// B10
const b10OverallChart = ref(null)  // 희망 상담 주기 및 횟수 (S2 Q10)
const b10RegionChart = ref(null)
const b10GroupChart = ref(null)
const b10LocationChart = ref(null)
// C4
const c4OverallChart = ref(null)   // 전체 만족 사항 (S3 Q4)
const c4RegionChart = ref(null)
const c4GroupChart = ref(null)
const c4LocationChart = ref(null)
// C5
const c5OverallChart = ref(null)   // 보강점 (S3 Q5)
const c5RegionChart = ref(null)
const c5GroupChart = ref(null)
const c5LocationChart = ref(null)

// 차트 인스턴스
const gradeCharts = ref({})
const enrollmentCharts = ref({})
const selfstudyCharts = ref({})
const etosCharts = ref({})
const miscReasonCharts = ref({}) // A5~C5 공통

// 처리된 데이터
const processedData = computed(() => {
  if (rawData.value.length === 0) return []
  return processData(rawData.value, questionMetadata.value)
})

// 권역/그룹 안내 정보
const regionGroupInfo = computed(() => {
  // 실제 데이터에서 권역/그룹/지점 정보 추출
  const regionMap = new Map()
  
  processedData.value.forEach(row => {
    if (!row.region || !row.group || !row.location) return
    
    if (!regionMap.has(row.region)) {
      regionMap.set(row.region, new Map())
    }
    
    const groupMap = regionMap.get(row.region)
    if (!groupMap.has(row.group)) {
      groupMap.set(row.group, new Set())
    }
    
    groupMap.get(row.group).add(row.location)
  })
  
  // 정렬 및 구조화
  const result = []
  
  // 권역 순서 정의
  const regionOrder = ['수도권', '강원/제주', '충청', '전라', '경상', '기숙', '기타']
  
  regionOrder.forEach(region => {
    if (!regionMap.has(region)) return
    
    const groupMap = regionMap.get(region)
    const groups = []
    
    // 그룹별로 정렬 (숫자는 숫자 순, '기숙'은 마지막)
    const sortedGroups = Array.from(groupMap.keys()).sort((a, b) => {
      const aNum = parseInt(a)
      const bNum = parseInt(b)
      const aIsNum = !isNaN(aNum)
      const bIsNum = !isNaN(bNum)
      
      if (aIsNum && bIsNum) return aNum - bNum
      if (aIsNum && !bIsNum) return -1
      if (!aIsNum && bIsNum) return 1
      return a.localeCompare(b)
    })
    
    sortedGroups.forEach(group => {
      const locations = Array.from(groupMap.get(group)).sort()
      groups.push({
        group: group,
        locations: locations
      })
    })
    
    if (groups.length > 0) {
      result.push({
        region: region,
        groups: groups
      })
    }
  })
  
  // 정의되지 않은 권역 추가
  regionMap.forEach((groupMap, region) => {
    if (!regionOrder.includes(region)) {
      const groups = []
      const sortedGroups = Array.from(groupMap.keys()).sort()
      
      sortedGroups.forEach(group => {
        const locations = Array.from(groupMap.get(group)).sort()
        groups.push({
          group: group,
          locations: locations
        })
      })
      
      if (groups.length > 0) {
        result.push({
          region: region,
          groups: groups
        })
      }
    }
  })
  
  return result
})

// 필터링된 데이터
const filteredData = computed(() => {
  return filterByHierarchy(processedData.value, filters.value)
})

// 사용 가능한 필터 옵션
const availableRegions = computed(() => {
  const regions = new Set()
  processedData.value.forEach(row => {
    if (row.region) regions.add(row.region)
  })
  return Array.from(regions).sort()
})

const availableGroups = computed(() => {
  const groups = new Set()
  processedData.value.forEach(row => {
    if (filters.value.region === '전체' || row.region === filters.value.region) {
      if (row.group) groups.add(row.group)
    }
  })
  // 그룹 정렬: 숫자 그룹은 숫자 순으로, '기숙'은 마지막에
  return Array.from(groups).sort((a, b) => {
    // 숫자 그룹과 비숫자 그룹 분리
    const aNum = parseInt(a)
    const bNum = parseInt(b)
    const aIsNum = !isNaN(aNum)
    const bIsNum = !isNaN(bNum)
    
    if (aIsNum && bIsNum) {
      return aNum - bNum  // 숫자끼리는 숫자 순
    }
    if (aIsNum && !bIsNum) {
      return -1  // 숫자가 앞에
    }
    if (!aIsNum && bIsNum) {
      return 1   // 숫자가 앞에
    }
    return a.localeCompare(b)  // 둘 다 숫자가 아니면 문자열 순
  })
})

const availableLocations = computed(() => {
  const locations = new Set()
  processedData.value.forEach(row => {
    if ((filters.value.region === '전체' || row.region === filters.value.region) &&
        (filters.value.group === '전체' || row.group === filters.value.group)) {
      if (row.location) locations.add(row.location)
    }
  })
  return Array.from(locations).sort()
})

const availableQuestions = computed(() => {
  // 사용자 요청에 따른 분류
  return [
    { code: 'S3 Q3', name: '전반적인 만족도(불만족)' },
    { code: 'S2 Q1', name: '학습관리 불만족' }, // S2 Q1이 학습관리 만족도 (보기2: 불만족)
    { code: 'S2 Q4', name: '생활관리 불만족' },
    { code: 'S2 Q8', name: '상담 불만족' },
    { code: 'S3 Q2', name: '시설 불만족' },
    { code: 'S3 Q6', name: '보강점' }
  ]
})

// 메트릭 계산
const metrics = computed(() => calculateMetrics(filteredData.value))
const metricsByRegion = computed(() => {
  const regionData = filterByHierarchy(
    processedData.value,
    { ...filters.value, group: '전체', location: '전체' }
  )
  return calculateMetrics(regionData)
})

const metricsByGroup = computed(() => {
  const groupData = filterByHierarchy(
    processedData.value,
    { ...filters.value, location: '전체' }
  )
  return calculateMetrics(groupData)
})

const metricsByLocation = computed(() => {
  return calculateMetrics(filteredData.value)
})

// 학년 구분 데이터 계산
const gradeData = computed(() => {
  const calculateGradeDistribution = (data) => {
    const distribution = { '재학생': 0, '재수생': 0, '삼수이상': 0, '검정고시': 0, '기타': 0 }
    let total = 0
    
    data.forEach(row => {
      // 여러 방법으로 학년 데이터 찾기
      let gradeValue = null
      
      // 1. additionalResponses에서 찾기
      if (row.additionalResponses && row.additionalResponses.length > 0) {
        const gradeResponse = row.additionalResponses.find(r => 
          (r.questionCode === 'S1 Q1' || r.questionCode === 'A1') || 
          (r.questionName && (r.questionName.includes('학년 구분') || r.questionName.includes('학년구분')))
        )
        
        if (gradeResponse) {
          gradeValue = gradeResponse.score?.toString().trim() || gradeResponse.textResponse?.trim() || ''
        }
      }
      
      // 2. responses에서 직접 찾기
      if (!gradeValue && row.responses && row.responses['S1 Q1']) {
        gradeValue = row.responses['S1 Q1'].toString().trim()
      }
      
      // 3. rawData에서 직접 찾기 (fallback)
      if (!gradeValue && row.rawRow && row.rawRow['S1 Q1']) {
        gradeValue = row.rawRow['S1 Q1'].toString().trim()
      }
      
      if (gradeValue && gradeValue !== '(응답 없음)' && gradeValue !== '') {
        const grade = gradeValue.toString().trim()
        
        // 숫자 값 우선 처리 (1=재학생, 2=재수생, 3=삼수이상, 4=검정고시)
        if (/^[1-4]$/.test(grade)) {
          const num = parseInt(grade)
          if (num === 1) {
            distribution['재학생']++
            total++
          } else if (num === 2) {
            distribution['재수생']++
            total++
          } else if (num === 3) {
            distribution['삼수이상']++
            total++
          } else if (num === 4) {
            distribution['검정고시']++
            total++
          }
        } else {
          // 텍스트 값 처리 (fallback)
          const gradeLower = grade.toLowerCase()
          if (gradeLower.includes('재학생') || gradeLower.startsWith('1.')) {
            distribution['재학생']++
            total++
          } else if (gradeLower.includes('재수생') || gradeLower.startsWith('2.')) {
            distribution['재수생']++
            total++
          } else if (gradeLower.includes('삼수') || gradeLower.startsWith('3.')) {
            distribution['삼수이상']++
            total++
          } else if (gradeLower.includes('검정고시') || gradeLower.startsWith('4.')) {
            distribution['검정고시']++
            total++
          } else if (grade && !grade.match(/^\d+$/)) {
            distribution['기타']++
            total++
          }
        }
      }
    })
    
    console.log('학년 구분 데이터:', { distribution, total, dataLength: data.length })
    return { distribution, total }
  }
  
  return {
    overall: calculateGradeDistribution(processedData.value),
    region: calculateGradeDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' })),
    group: calculateGradeDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' })),
    location: calculateGradeDistribution(filteredData.value)
  }
})

// 자기주도학습 선택 이유 데이터 계산
const selfstudyReasonData = computed(() => {
  const calculateReasonDistribution = (data) => {
    const distribution = {}
    let total = 0
    
    data.forEach(row => {
      // 여러 방법으로 자기주도학습 선택 이유 데이터 찾기
      let reasonValue = null
      
      // 1. additionalResponses에서 찾기
      if (row.additionalResponses && row.additionalResponses.length > 0) {
        const reasonResponse = row.additionalResponses.find(r => 
          (r.questionCode === 'S1 Q3' || r.questionCode === 'A3') || 
          (r.questionName && r.questionName.includes('자기주도학습'))
        )
        
        if (reasonResponse) {
          // 선택지 번호(1~7)를 우선 사용, 텍스트는 보조로만 사용
          reasonValue = reasonResponse.score?.toString().trim() || reasonResponse.textResponse?.trim() || ''
        }
      }
      
      // 2. rawRow에서 직접 찾기 (fallback)
      if (!reasonValue && row.rawRow && row.rawRow['S1 Q3']) {
        reasonValue = row.rawRow['S1 Q3'].toString().trim()
      }
      
      if (reasonValue && reasonValue !== '(응답 없음)' && reasonValue !== '' && reasonValue.length > 0) {
        let keyRaw = reasonValue.toString().trim()
        
        // 1~7 보기 번호를 정식 보기 문구로 매핑
        const numMatch = keyRaw.match(/^(\d+)/)
        let key = keyRaw
        if (numMatch) {
          const code = numMatch[1]
          const mapping = {
            '1': '인터넷 강의 중심 학습',
            '2': '부족한 과목 집중 학습',
            '3': '자유로운 시간 관리',
            '4': '순공 시간 확보',
            '5': '재수종합학원의 비효율성',
            '6': '기타'
          }
          key = mapping[code] || keyRaw
        } else {
          // 번호가 아닌 순수 주관식 응답은 전부 "기타"로 집계
          key = '기타'
        }
        
        // "기타" 관련 응답은 모두 하나로 통합
        if (key.includes('기타')) {
          key = '기타'
        }
        
        // 동일한 응답 집계
        distribution[key] = (distribution[key] || 0) + 1
        total++
      }
    })
    
    // 상위 10개만 표시 (빈도수 기준 정렬)
    const sortedEntries = Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    return { distribution: Object.fromEntries(sortedEntries), total }
  }
  
  return {
    overall: calculateReasonDistribution(processedData.value),
    region: calculateReasonDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' })),
    group: calculateReasonDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' })),
    location: calculateReasonDistribution(filteredData.value)
  }
})

// 이투스247학원 선택 이유 데이터 계산
const etosReasonData = computed(() => {
  const calculateReasonDistribution = (data) => {
    const distribution = {}
    let total = 0
    
    data.forEach(row => {
      // 여러 방법으로 이투스247학원 선택 이유 데이터 찾기
      let reasonValue = null
      
      // 1. additionalResponses에서 찾기
      if (row.additionalResponses && row.additionalResponses.length > 0) {
        const reasonResponse = row.additionalResponses.find(r => 
          (r.questionCode === 'S1 Q4' || r.questionCode === 'A4') || 
          (r.questionName && r.questionName.includes('이투스247학원을 선택'))
        )
        
        if (reasonResponse) {
          // 선택지 번호(1~6)를 우선 사용, 텍스트는 보조로만 사용
          reasonValue = reasonResponse.score?.toString().trim() || reasonResponse.textResponse?.trim() || ''
        }
      }
      
      // 2. rawRow에서 직접 찾기 (fallback)
      if (!reasonValue && row.rawRow && row.rawRow['S1 Q4']) {
        reasonValue = row.rawRow['S1 Q4'].toString().trim()
      }
      
      if (reasonValue && reasonValue !== '(응답 없음)' && reasonValue !== '' && reasonValue.length > 0) {
        let keyRaw = reasonValue.toString().trim()
        
        // 1~6 보기 번호를 정식 보기 문구로 매핑
        const numMatch = keyRaw.match(/^(\d+)/)
        let key = keyRaw
        if (numMatch) {
          const code = numMatch[1]
          const mapping = {
            '1': '담임 선생님의 상담',
            '2': '학습관리',
            '3': '생활관리',
            '4': '입시관리',
            '5': '학습공간 및 시설',
            '6': '집과의 거리가 가까워서',
            '7': '기타'
          }
          key = mapping[code] || keyRaw
        } else {
          // 번호가 아닌 순수 주관식 응답은 전부 "기타"로 집계
          key = '기타'
        }
        
        // "기타" 관련 응답은 모두 하나로 통합
        if (key.includes('기타')) {
          key = '기타'
        }
        
        // 동일한 응답 집계
        distribution[key] = (distribution[key] || 0) + 1
        total++
      }
    })
    
    // 상위 10개만 표시 (빈도수 기준 정렬)
    const sortedEntries = Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    return { distribution: Object.fromEntries(sortedEntries), total }
  }
  
  return {
    overall: calculateReasonDistribution(processedData.value),
    region: calculateReasonDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' })),
    group: calculateReasonDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' })),
    location: calculateReasonDistribution(filteredData.value)
  }
})

// 입학시기 데이터 계산
const enrollmentData = computed(() => {
  const calculateEnrollmentDistribution = (data) => {
    const distribution = {}
    let total = 0
    
    data.forEach(row => {
      // 여러 방법으로 입학시기 데이터 찾기
      let enrollmentValue = null
      
      // 1. additionalResponses에서 찾기
      if (row.additionalResponses && row.additionalResponses.length > 0) {
        const enrollmentResponse = row.additionalResponses.find(r => 
          (r.questionCode === 'S1 Q2' || r.questionCode === 'A2') || 
          (r.questionName && r.questionName.includes('입학시기'))
        )
        
        if (enrollmentResponse) {
          enrollmentValue = enrollmentResponse.score?.toString().trim() || enrollmentResponse.textResponse?.trim() || ''
        }
      }
      
      // 2. responses에서 직접 찾기
      if (!enrollmentValue && row.responses && row.responses['S1 Q2']) {
        enrollmentValue = row.responses['S1 Q2'].toString().trim()
      }
      
      // 3. rawData에서 직접 찾기 (fallback)
      if (!enrollmentValue && row.rawRow && row.rawRow['S1 Q2']) {
        enrollmentValue = row.rawRow['S1 Q2'].toString().trim()
      }
      
      if (enrollmentValue && enrollmentValue !== '(응답 없음)' && enrollmentValue !== '') {
        // 코드(1~4)를 보기 텍스트로 매핑
        let key = enrollmentValue.toString().trim()

        // 숫자 값 우선 처리 (1=11월~1월, 2=2월~4월, 3=5월~7월, 4=8월~9월)
        if (/^[1-4]$/.test(key)) {
          const mapping = {
            '1': '11월~1월',
            '2': '2월~4월',
            '3': '5월~7월',
            '4': '8월~9월'
          }
          key = mapping[key] || key
        } else {
          // 숫자 앞에 "8. 기타" 같은 형태로 들어올 경우 숫자 추출
          const numMatch = key.match(/^(\d+)\.?\s*/)
          if (numMatch && /^[1-4]$/.test(numMatch[1])) {
            const mapping = {
              '1': '11월~1월',
              '2': '2월~4월',
              '3': '5월~7월',
              '4': '8월~9월'
            }
            key = mapping[numMatch[1]] || key
          }
        }
        
        // 너무 긴 텍스트는 잘라서 표시 (예: 설명형 응답)
        if (key.length > 40) {
          key = key.substring(0, 40) + '...'
        }
        
        distribution[key] = (distribution[key] || 0) + 1
        total++
      }
    })
    
    // 응답 텍스트 기준으로 정렬 (가나다순)
    const sortedEntries = Object.entries(distribution).sort((a, b) => a[0].localeCompare(b[0]))
    
    console.log('입학시기 데이터:', { distribution: Object.fromEntries(sortedEntries), total, dataLength: data.length })
    return { distribution: Object.fromEntries(sortedEntries), total }
  }
  
  return {
    overall: calculateEnrollmentDistribution(processedData.value),
    region: calculateEnrollmentDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' })),
    group: calculateEnrollmentDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' })),
    location: calculateEnrollmentDistribution(filteredData.value)
  }
})

// 공통: 단일 문항(코드)의 분포 계산 (필터된 데이터 기준, 상위 10개)
function calculateQuestionDistribution(data, questionCode) {
  const distribution = {}
  let total = 0
  let rowCount = 0 // 응답한 행 수
  
  // 디버깅: S1 Q7, S1 Q8, S2 Q2, S2 Q5, S2 Q7, S2 Q9, S2 Q10, S3 Q4, S3 Q5의 경우 상세 로그
  const debugS1Q7 = questionCode === 'S1 Q7'
  const debugS1Q8 = questionCode === 'S1 Q8'
  const debugS2Q2 = questionCode === 'S2 Q2'
  const debugS2Q5 = questionCode === 'S2 Q5'
  const debugS2Q7 = questionCode === 'S2 Q7'
  const debugS2Q9 = questionCode === 'S2 Q9'
  const debugS2Q10 = questionCode === 'S2 Q10'
  const debugS3Q4 = questionCode === 'S3 Q4'
  const debugS3Q5 = questionCode === 'S3 Q5'
  const debugValues = []
  let skippedCount = 0
  let skippedReasons = { noValue: 0, empty: 0, noParts: 0 }
  
  data.forEach(row => {
    let value = null

    // 1) rawRow에서 우선 찾기 (원본 로우데이터 기준)
    if (row.rawRow && row.rawRow[questionCode]) {
      value = row.rawRow[questionCode]
    }

    // 2) 없으면 responses에서 찾기
    if (!value && row.responses && row.responses[questionCode]) {
      value = row.responses[questionCode]
    }
    
    if (!value) {
      skippedCount++
      if (debugS1Q7) skippedReasons.noValue++
      return
    }
    
    const raw = value.toString().trim()
    // 빈 값 체크 강화: 공백만 있는 경우도 제외
    if (!raw || raw === '' || raw === '(응답 없음)' || raw === '없음' || raw === 'null' || raw === 'undefined') {
      skippedCount++
      if (debugS1Q7) skippedReasons.empty++
      return
    }

    // 다중응답: "1,4,7" 처럼 들어온 값은 각각을 별도 카운트
    const parts = raw.split(',').map(p => p.trim()).filter(p => p !== '' && p !== '없음' && p !== '(응답 없음)')
    if (parts.length === 0) {
      skippedCount++
      if (debugS1Q7) skippedReasons.noParts++
      return
    }
    
    rowCount++ // 응답한 행 카운트
    
    // 디버깅: S1 Q7, S1 Q8, S2 Q2, S2 Q5, S2 Q7, S2 Q9, S2 Q10, S3 Q4, S3 Q5의 경우 원본 값 저장 (처음 20개만)
    if ((debugS1Q7 || debugS1Q8 || debugS2Q2 || debugS2Q5 || debugS2Q7 || debugS2Q9 || debugS2Q10 || debugS3Q4 || debugS3Q5) && debugValues.length < 20) {
      debugValues.push({ raw, parts, location: row.location })
    }

    parts.forEach(part => {
      let label = part

      // A5: 학원 등록 전, 공부한 곳 → 보기 번호를 보기 텍스트로 매핑
      if (questionCode === 'S1 Q5') {
        const match = label.match(/^(\d+)/) // "1", "1. 잇올" 등
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '잇올',
            '2': '러셀',
            '3': '독학재수학원',
            '4': '독학기숙학원',
            '5': '재수종합학원',
            '6': '재종기숙학원',
            '7': '프리미엄 독서실 & 스터디 카페',
            '8': '없음',
            '9': '기타'
          }
          // 정의된 번호이면 해당 보기로, 그 외 숫자는 기타로 처리
          label = mapping[code] || '기타'
        } else {
          // 번호 없이 서술형으로만 쓴 경우는 모두 기타 (기타 주관식 응답)
          label = '기타'
        }
      }

      // A6: 학원 선택 시, 고려했던 학원이나 독서실(스터디카페) → 보기 번호를 보기 텍스트로 매핑
      if (questionCode === 'S1 Q6') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '잇올',
            '2': '러셀',
            '3': '독학재수학원',
            '4': '독학기숙학원',
            '5': '재수종합학원',
            '6': '재종기숙학원',
            '7': '프리미엄 독서실 & 스터디 카페',
            '8': '없음',
            '9': '기타'
          }
          label = mapping[code] || '기타'
        } else {
          label = '기타'
        }
      }

      // A6: 학원 선택 시, 고려했던 학원이나 독서실(스터디카페) → 보기 번호를 보기 텍스트로 매핑
      if (questionCode === 'S1 Q7') {
        // "8. 기타" 같은 형식에서 숫자만 추출
        const match = label.match(/^(\d+)/) // "1", "1. 잇올", "8. 기타" 등에서 숫자 추출
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '잇올',
            '2': '러셀',
            '3': '독학재수학원',
            '4': '독학기숙학원',
            '5': '재수종합학원',
            '6': '재종기숙학원',
            '7': '프리미엄 독서실 & 스터디 카페',
            '8': '없음',
            '9': '기타'
          }
          // 정의된 번호(1-9)만 매핑하고, 그 외는 기타로 처리
          if (mapping[code]) {
            label = mapping[code]
          } else {
            // 10 이상의 숫자나 정의되지 않은 숫자는 기타
            label = '기타'
          }
        } else {
          // 숫자로 시작하지 않는 경우 처리
          // "기타", "없음" 등의 텍스트 직접 매칭
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('없음') || lowerLabel === 'none' || lowerLabel === '') {
            label = '없음'
          } else if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            // 기타 텍스트는 모두 "기타"로 처리
            label = '기타'
          } else {
            // 빈 값은 건너뛰기
            return // 이 return은 parts.forEach 내부에서 해당 part만 건너뛰기
          }
        }
      }

      // A7: 인지경로 → 보기 번호를 보기 텍스트로 매핑
      // S1 Q9: "A7. 어떻게 처음 인지하게 되었나요?"
      if (questionCode === 'S1 Q9') {
        // "9. 기타" 같은 형식에서 숫자만 추출
        const match = label.match(/^(\d+)/) // "1", "1. 인터넷 검색 및 SNS", "9. 기타" 등에서 숫자 추출
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '인터넷 검색 및 SNS',
            '2': '입시, 공부 관련 유튜브 채널',
            '3': '입시/학습 커뮤니티',
            '4': '가족 추천',
            '5': '지인 추천',
            '6': '집과 가까움 / 지나다니면서 봄',
            '7': '학원 광고물',
            '8': '고등학교 재학 중 윈터,썸머스쿨에 다닌 경험이 있음',
            '9': '기타'
          }
          // 정의된 번호(1-9)만 매핑하고, 그 외는 기타로 처리
          if (mapping[code]) {
            label = mapping[code]
          } else {
            // 10 이상의 숫자나 정의되지 않은 숫자는 기타
            label = '기타'
          }
        } else {
          // 숫자로 시작하지 않는 경우 처리
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            // 기타 텍스트는 모두 "기타"로 처리
            label = '기타'
          } else {
            // 빈 값은 건너뛰기
            return // 이 return은 parts.forEach 내부에서 해당 part만 건너뛰기
          }
        }
      }
      
      // label이 설정되지 않은 경우 처리
      if (!label || label === '') return // 이 return도 parts.forEach 내부

      // B2: 학습관리 만족 사항 → 보기 번호를 보기 텍스트로 매핑
      // S2 Q2: "B2. 학습관리 중 가장 만족하는 것은 무엇인가요?"
      if (questionCode === 'S2 Q2') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '학습 성향 및 성취도 진단',
            '2': '학습 계획 플래너 관리',
            '3': '인강(교재)추천 및 수강 관리',
            '4': '성적 리포팅 및 관리',
            '5': '1:1 질의응답',
            '6': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // B5: 생활관리 만족 사항 → 보기 번호를 보기 텍스트로 매핑
      // S2 Q5: "B5. 생활관리 중 가장 만족하는 것은 무엇인가요?"
      if (questionCode === 'S2 Q5') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '면학분위기 조성',
            '2': '출결 및 외출 관리',
            '3': '휴대폰 관리',
            '4': '졸음관리',
            '5': '체계적인 시간표 운영',
            '6': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // B7: 입시관리 만족 사항 → 보기 번호를 보기 텍스트로 매핑
      // S2 Q7: "B7. 입시관리 중 가장 만족하는 것은 무엇인가요?"
      if (questionCode === 'S2 Q7') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '모집요강 분석 자료 제공',
            '2': '입시 결과 자료 제공',
            '3': '대학/학과 추천',
            '4': '학생부 분석',
            '5': '정시 원서 상담',
            '6': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // B9: 상담 만족 사항 → 보기 번호를 보기 텍스트로 매핑
      // S2 Q9: "B9. 선생님과의 상담 중 가장 만족하는 것은 무엇인가요?"
      if (questionCode === 'S2 Q9') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '성적/학습 관련 상담',
            '2': '생활 및 고민 상담',
            '3': '입시 및 진학 상담',
            '4': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // B10: 희망 상담 주기 및 횟수 → 보기 번호를 보기 텍스트로 매핑
      // S2 Q10: "B10. 희망하는 (학습/생활/입시)상담 주기 및 횟수를 선택해주세요."
      if (questionCode === 'S2 Q10') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '주 1~2회 진행',
            '2': '2주 1회 진행',
            '3': '3주 1회 진행',
            '4': '한 달에 한 번 진행',
            '5': '수시 진행',
            '6': '상담 안 함'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('상담 안 함') || lowerLabel.includes('안함') || lowerLabel.includes('안 함')) {
            label = '상담 안 함'
          } else if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // C4: 전체 만족 사항 → 보기 번호를 보기 텍스트로 매핑
      // S3 Q4: "C4. 이투스247학원에서 가장 만족하는 것은 무엇인가요?"
      if (questionCode === 'S3 Q4') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '학습관리',
            '2': '생활관리',
            '3': '입시 관리',
            '4': '정기적 상담',
            '5': '학습공간 및 시설',
            '6': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // C5: 보강점 → 보기 번호를 보기 텍스트로 매핑
      // S3 Q5: "C5. 이투스247학원이 보강해야 할 것은 무엇인가요?"
      if (questionCode === 'S3 Q5') {
        const match = label.match(/^(\d+)/)
        if (match) {
          const code = match[1]
          const mapping = {
            '1': '학습관리',
            '2': '생활관리',
            '3': '입시 관리',
            '4': '정기적 상담',
            '5': '학습공간 및 시설',
            '6': '무료로 제공하는 학습 콘텐츠',
            '7': '기타'
          }
          if (mapping[code]) {
            label = mapping[code]
          } else {
            label = '기타'
          }
        } else {
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            label = '기타'
          } else {
            return
          }
        }
      }

      // A8: 정보탐색 경로 → 보기 번호를 보기 텍스트로 매핑
      // S1 Q10: "A8. 이투스247학원 관련 정보를 가장 많이 얻은 곳은 어디인가요?"
      if (questionCode === 'S1 Q10') {
        // "8. 기타" 같은 형식에서 숫자만 추출
        const match = label.match(/^(\d+)/) // "1", "1. 이투스247학원 홈페이지", "8. 기타" 등에서 숫자 추출
        if (match) {
          const code = match[1]
          // S1 Q8은 실제로 "A6-1" 문항이지만, 사용자가 정보탐색 경로라고 했으므로
          // S1 Q10의 매핑을 사용 (이투스247학원 관련 정보를 가장 많이 얻은 곳)
          const mapping = {
            '1': '이투스247학원 홈페이지',
            '2': '재원생 SNS 후기',
            '3': '이투스247학원 유튜브 채널',
            '4': '입시/학습 커뮤니티',
            '5': '가족',
            '6': '지인',
            '7': '학원 상담',
            '8': '기타'
          }
          // 정의된 번호(1-8)만 매핑하고, 그 외는 기타로 처리
          if (mapping[code]) {
            label = mapping[code]
          } else {
            // 9 이상의 숫자나 정의되지 않은 숫자는 기타
            label = '기타'
          }
        } else {
          // 숫자로 시작하지 않는 경우 처리
          const lowerLabel = label.toLowerCase()
          if (lowerLabel.includes('기타') || lowerLabel === 'other' || lowerLabel === 'etc') {
            label = '기타'
          } else if (lowerLabel.length > 0) {
            // 기타 텍스트는 모두 "기타"로 처리
            label = '기타'
          } else {
            // 빈 값은 건너뛰기
            return
          }
        }
      }
      
      // "기타"가 포함된 응답은 모두 하나의 "기타"로 통합
      if (label.includes('기타')) {
        label = '기타'
      } else {
        // 너무 긴 텍스트는 잘라서 표시
        if (label.length > 40) {
          label = label.substring(0, 40) + '...'
        }
      }
      
      distribution[label] = (distribution[label] || 0) + 1
      total++
    })
  })
  
  const sortedEntries = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  // 디버깅: S2 Q2의 경우 실제 데이터와 비교
  if (questionCode === 'S2 Q2') {
    const expectedData = {
      '학습 성향 및 성취도 진단': 286,
      '학습 계획 플래너 관리': 304,
      '인강(교재)추천 및 수강 관리': 292,
      '성적 리포팅 및 관리': 224,
      '1:1 질의응답': 315,
      '기타': 100
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S2 Q5의 경우 실제 데이터와 비교
  if (questionCode === 'S2 Q5') {
    const expectedData = {
      '면학분위기 조성': 529,
      '출결 및 외출 관리': 211,
      '휴대폰 관리': 425,
      '졸음관리': 145,
      '체계적인 시간표 운영': 179,
      '기타': 32
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S2 Q7의 경우 실제 데이터와 비교
  if (questionCode === 'S2 Q7') {
    const expectedData = {
      '대학별 모집요강 분석 자료 제공': 352,
      '대학별 입시 결과 자료 제공': 158,
      '성적&적성에 따른 대학 및 학과 추천': 414,
      '수시 지원을 위한 학생부 분석': 68,
      '정시 원서 접수를 위한 상담': 369,
      '기타': 160
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S2 Q9의 경우 실제 데이터와 비교
  if (questionCode === 'S2 Q9') {
    const expectedData = {
      '성적/학습 방향 및 계획 관련 상담': 1112,
      '생활 및 고민 상담': 229,
      '입시 및 진학 상담': 119,
      '기타': 61
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S2 Q10의 경우 실제 데이터와 비교
  if (questionCode === 'S2 Q10') {
    const expectedData = {
      '주 1~2회 진행': 395,
      '2주 1회 진행': 420,
      '3주 1회 진행': 163,
      '한 달에 한 번 진행': 327,
      '주기나 횟수에 상관 없이 수시로 진행': 128,
      '상담 안 함': 88
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S3 Q4의 경우 실제 데이터와 비교
  if (questionCode === 'S3 Q4') {
    const expectedData = {
      '학습관리': 475,
      '생활관리': 589,
      '입시 관리': 103,
      '정기적 상담': 141,
      '학습공간 및 시설': 164,
      '기타': 33
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S3 Q5의 경우 실제 데이터와 비교
  if (questionCode === 'S3 Q5') {
    const expectedData = {
      '학습관리': 182,
      '생활관리': 277,
      '입시 관리': 153,
      '정기적 상담': 80,
      '학습공간 및 시설': 271,
      '무료로 제공하는 학습 콘텐츠': 258,
      '기타': 284
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S1 Q7의 경우 실제 데이터와 비교
  if (questionCode === 'S1 Q7') {
    const expectedData = {
      '잇올': 403,
      '러셀': 147,
      '독학재수학원': 180,
      '독학기숙학원': 49,
      '재수종합학원': 156,
      '재종기숙학원': 49,
      '프리미엄 독서실 & 스터디 카페': 93,
      '없음': 461,
      '기타': 22
    }
    
    const result = Object.fromEntries(sortedEntries)
    const diff = {}
    Object.keys(expectedData).forEach(key => {
      const expected = expectedData[key]
      const actual = result[key] || 0
      if (expected !== actual) {
        diff[key] = { expected, actual, diff: actual - expected }
      }
    })
    
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: result,
      기대값: expectedData,
      차이: Object.keys(diff).length > 0 ? diff : '일치함',
      총합: {
        계산: total,
        기대: Object.values(expectedData).reduce((a, b) => a + b, 0),
        차이: total - Object.values(expectedData).reduce((a, b) => a + b, 0)
      },
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`
    })
  }
  
  // 디버깅: S1 Q8의 경우 상세 로그
  if (questionCode === 'S1 Q8') {
    console.log(`[${questionCode}] 데이터 검증:`, {
      전체데이터행수: data.length,
      응답한행수: rowCount,
      건너뛴행수: skippedCount,
      건너뛴이유: skippedReasons,
      계산된값: Object.fromEntries(sortedEntries),
      샘플데이터: debugValues,
      distribution전체: distribution,
      처리율: `${((rowCount / data.length) * 100).toFixed(1)}%`,
      총합: total
    })
  }
  
  return { distribution: Object.fromEntries(sortedEntries), total }
}

// A5~C5: 선택/만족/보강 문항 분포 (전체/권역/그룹/지점별)
const a5Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S1 Q5'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S1 Q5'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S1 Q5'),
  location: calculateQuestionDistribution(filteredData.value, 'S1 Q5')
})) // 학원 등록 전, 공부한 곳

const a6Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S1 Q6'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S1 Q6'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S1 Q6'),
  location: calculateQuestionDistribution(filteredData.value, 'S1 Q6')
})) // 학원 선택 시, 고려했던 곳

const a7Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S1 Q9'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S1 Q9'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S1 Q9'),
  location: calculateQuestionDistribution(filteredData.value, 'S1 Q9')
})) // 인지 경로

const a8Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S1 Q10'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S1 Q10'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S1 Q10'),
  location: calculateQuestionDistribution(filteredData.value, 'S1 Q10')
})) // 정보탐색 경로

const b2Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S2 Q2'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S2 Q2'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S2 Q2'),
  location: calculateQuestionDistribution(filteredData.value, 'S2 Q2')
})) // 학습관리 만족 사항

const b5Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S2 Q5'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S2 Q5'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S2 Q5'),
  location: calculateQuestionDistribution(filteredData.value, 'S2 Q5')
})) // 생활관리 만족 사항

const b7Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S2 Q7'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S2 Q7'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S2 Q7'),
  location: calculateQuestionDistribution(filteredData.value, 'S2 Q7')
})) // 입시관리 만족 사항

const b9Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S2 Q9'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S2 Q9'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S2 Q9'),
  location: calculateQuestionDistribution(filteredData.value, 'S2 Q9')
})) // 상담 만족 사항

const b10Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S2 Q10'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S2 Q10'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S2 Q10'),
  location: calculateQuestionDistribution(filteredData.value, 'S2 Q10')
})) // 희망 상담 주기 및 횟수

const c4Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S3 Q4'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S3 Q4'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S3 Q4'),
  location: calculateQuestionDistribution(filteredData.value, 'S3 Q4')
})) // 전체 만족 사항

const c5Data = computed(() => ({
  overall: calculateQuestionDistribution(processedData.value, 'S3 Q5'),
  region: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, group: '전체', location: '전체' }), 'S3 Q5'),
  group: calculateQuestionDistribution(filterByHierarchy(processedData.value, { ...filters.value, location: '전체' }), 'S3 Q5'),
  location: calculateQuestionDistribution(filteredData.value, 'S3 Q5')
})) // 보강점

// 추가 문항 응답 필터링 (학년구분, 입학시기, 선택 이유 등)
const filteredAdditionalResponses = computed(() => {
  let responses = processedData.value
    .flatMap(row => row.additionalResponses || [])
    .filter(r => {
      // 응답이 없는 경우 제외
      if (!r.textResponse || 
          r.textResponse.trim() === '' || 
          r.textResponse === '(응답 없음)') {
        return false
      }
      
      // 필터 적용
      if (filters.value.region !== '전체' && r.region !== filters.value.region) return false
      if (filters.value.group !== '전체' && r.group !== filters.value.group) return false
      if (filters.value.location !== '전체' && r.location !== filters.value.location) return false
      
      // 문항 필터
      if (unsatisfiedFilter.value.question !== '전체' && r.questionCode !== unsatisfiedFilter.value.question) {
        return false
      }
      
      // 키워드 검색
      if (unsatisfiedFilter.value.keyword && !r.textResponse.toLowerCase().includes(unsatisfiedFilter.value.keyword.toLowerCase())) {
        return false
      }
      
      return true
    })
  
  return responses
})

// 불만족 응답 필터링
const filteredUnsatisfiedResponses = computed(() => {
  let responses = processedData.value
    .flatMap(row => row.unsatisfiedResponses || [])
    .filter(r => {
      // "6. 기타" 같은 선택지 패턴 제외
      const textResponseTrimmed = (r.textResponse || '').toString().trim()
      if (textResponseTrimmed === '6. 기타' || 
          textResponseTrimmed === '6 기타' ||
          textResponseTrimmed.match(/^\d+\.?\s*기타$/)) {
        return false
      }
      
      // 주관식 답변이 없는 경우 제외
      // 단, 만족/불만족 문항(S3 Q3, S2 Q1, S2 Q4, S2 Q8, S3 Q2)과 보강점(S3 Q6)은 제외 - 2번 선택 자체가 중요한 정보
      const satisfactionQuestions = ['S3 Q3', 'S2 Q1', 'S2 Q4', 'S2 Q8', 'S3 Q2', 'S3 Q6']
      if (!satisfactionQuestions.includes(r.questionCode)) {
        if (!r.textResponse || 
            r.textResponse.trim() === '' || 
            r.textResponse === '(주관식 답변 없음)' ||
            r.textResponse === '(응답 없음)' ||
            r.textResponse.toLowerCase().includes('주관식 답변 없음')) {
          return false
        }
      }
      
      // 필터 적용
      if (filters.value.region !== '전체' && r.region !== filters.value.region) return false
      if (filters.value.group !== '전체' && r.group !== filters.value.group) return false
      if (filters.value.location !== '전체' && r.location !== filters.value.location) return false
      
      // 문항 필터
      if (unsatisfiedFilter.value.question !== '전체') {
        if (r.questionCode !== unsatisfiedFilter.value.question) {
          return false
        }
      }
      
      // 키워드 검색
      if (unsatisfiedFilter.value.keyword && !r.textResponse.toLowerCase().includes(unsatisfiedFilter.value.keyword.toLowerCase())) {
        return false
      }
      
      return true
    })
  
  return responses
})

// 모든 응답 합치기 (불만족만)
const allFilteredResponses = computed(() => {
  return filteredUnsatisfiedResponses.value
})

const totalPages = computed(() => Math.ceil(allFilteredResponses.value.length / itemsPerPage))

const paginatedUnsatisfiedResponses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allFilteredResponses.value.slice(start, end)
})

// 이벤트 핸들러
// 검색 결과에서 지점 선택 시 필터 자동 적용
function selectLocationFromSearch(result) {
  if (result && result.location) {
    filters.value.region = result.region || '전체'
    filters.value.group = result.group || '전체'
    filters.value.location = result.location
    // 검색창 초기화 (선택적)
    // locationSearchQuery.value = ''
  }
}

const onFilterChange = () => {
  // 그룹이나 권역이 변경되면 하위 필터 리셋
  if (filters.value.region === '전체') {
    if (filters.value.group !== '전체') {
      filters.value.group = '전체'
    }
  }
  if (filters.value.group === '전체') {
    if (filters.value.location !== '전체') {
      filters.value.location = '전체'
    }
  }
  currentPage.value = 1
}

const onUnsatisfiedFilterChange = () => {
  currentPage.value = 1
}

/**
 * 이름 마스킹 (개인정보 보호)
 * 2글자: 첫 글자 + * (예: "김나" → "김*")
 * 3글자: 첫 글자 + * + 마지막 글자 (예: "김나연" → "김*연")
 * 4글자 이상: 첫 글자 + ** + 마지막 글자 (예: "홍길동김" → "홍**김")
 */
function maskName(name) {
  if (!name || typeof name !== 'string') return name || ''
  
  const trimmed = name.trim()
  const length = trimmed.length
  
  if (length === 0) return ''
  if (length === 1) return '*'
  if (length === 2) return trimmed[0] + '*'
  if (length === 3) return trimmed[0] + '*' + trimmed[2]
  
  // 4글자 이상
  return trimmed[0] + '**' + trimmed[length - 1]
}

/**
 * 욕설 필터링 (주관식 답변에서 욕설 마스킹)
 * "ㅅㅂ" → "**"
 * "조오나" → "***"
 * "ㅗㅗㅗㅗ" → "****"
 * "ㅗㅗ" → "**"
 * "시발" → "**"
 */
function filterProfanity(text) {
  if (!text || typeof text !== 'string') return text || ''
  
  let filtered = text
  
  // "조오나"를 "***"로 치환
  filtered = filtered.replace(/조오나/g, '***')
  
  // "ㅗㅗㅗㅗ"를 "****"로 치환 (먼저 처리하여 "ㅗㅗ"와 겹치지 않도록)
  filtered = filtered.replace(/ㅗㅗㅗㅗ/g, '****')
  
  // "ㅗㅗ"를 "**"로 치환
  filtered = filtered.replace(/ㅗㅗ/g, '**')
  
  // "시발"을 "**"로 치환
  filtered = filtered.replace(/시발/g, '**')
  
  // "ㅅㅂ"를 "**"로 치환
  filtered = filtered.replace(/ㅅㅂ/g, '**')
  
  return filtered
}

/**
 * 만족도 점수 포맷팅 (주관식 답변과 중복 제거)
 * "2. 불만족, 이유 : 답변" → "2. 불만족"
 * "2. 불만족" → "2. 불만족"
 * "2" → "2. 불만족"
 * 긴 텍스트(주관식 답변)인 경우 → "2. 불만족"
 */
function formatSatisfactionScore(score, questionCode) {
  if (!score) return score || ''
  
  const scoreStr = score.toString().trim()
  
  // 만족/불만족 문항인 경우만 처리
  const satisfactionQuestions = ['S3 Q3', 'S2 Q1', 'S2 Q4', 'S2 Q8', 'S3 Q2']
  if (!satisfactionQuestions.includes(questionCode)) {
    return scoreStr
  }
  
  // 이미 "2. 불만족" 형식인 경우
  if (scoreStr === '2. 불만족' || scoreStr.match(/^2\.?\s*불만족$/)) {
    return '2. 불만족'
  }
  
  // "2. 불만족, 이유 :" 같은 형식인 경우
  if (scoreStr.includes('불만족')) {
    const match = scoreStr.match(/^(2\.?\s*불만족)/)
    if (match) {
      return match[1].replace(/^2\.?\s*/, '2. ')
    }
    return '2. 불만족'
  }
  
  // "2" 또는 "2."인 경우
  if (scoreStr === '2' || scoreStr === '2.') {
    return '2. 불만족'
  }
  
  // "1. 만족" 형식인 경우
  if (scoreStr.includes('만족') && !scoreStr.includes('불만족')) {
    const match = scoreStr.match(/^(1\.?\s*만족)/)
    if (match) {
      return match[1].replace(/^1\.?\s*/, '1. ')
    }
    return '1. 만족'
  }
  
  // "1" 또는 "1."인 경우
  if (scoreStr === '1' || scoreStr === '1.') {
    return '1. 만족'
  }
  
  // 긴 텍스트(주관식 답변이 직접 들어있는 경우)인 경우 "2. 불만족"으로 표시
  if (scoreStr.length >= 10 && /[가-힣]/.test(scoreStr)) {
    const isOptionPattern = /^[1-7]\./.test(scoreStr) || 
                           scoreStr.match(/^\d+\.\s*[가-힣]+/) ||
                           scoreStr.match(/^\d+\.\s*기타/) ||
                           /^[\d.,\s]+$/.test(scoreStr) ||
                           scoreStr === '1' || 
                           scoreStr === '2'
    
    if (!isOptionPattern) {
      return '2. 불만족'
    }
  }
  
  // 그 외의 경우 원본 반환
  return scoreStr
}

// 차트 생성 함수 (캔버스를 그대로 Chart.js에 전달)
function createGradeChart(canvasRef, data, label) {
  if (!canvasRef) {
    console.log(`차트 생성 실패 (${label}): canvasRef 없음`, canvasRef)
    return
  }
  
  // canvas 요소가 DOM에 연결되어 있는지 확인
  if (!canvasRef.ownerDocument || !canvasRef.getContext) {
    console.log(`차트 생성 실패 (${label}): canvas 요소가 준비되지 않음`, canvasRef)
    return
  }

  if (!data || !data.distribution || typeof data.total !== 'number') {
    console.warn(`학년 차트 데이터 이상 (${label}):`, data)
    data = { distribution: {}, total: 0 }
  }

  const { distribution, total } = data
  
  if (total === 0) {
    console.log(`차트 생성 실패 (${label}): 데이터 없음`, distribution)
    // 빈 차트 표시
    if (gradeCharts.value[label]) {
      gradeCharts.value[label].destroy()
    }
    gradeCharts.value[label] = new Chart(canvasRef, {
      type: 'pie',
      data: {
        labels: ['데이터 없음'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e0e0e0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    })
    return
  }
  
  // 기존 차트 제거 (우리 ref + Chart 전역 모두)
  if (gradeCharts.value[label]) {
    gradeCharts.value[label].destroy()
  }
  const existing = Chart.getChart(canvasRef)
  if (existing) existing.destroy()
  
  const labels = []
  const values = []
  const colors = []
  
  // 학년 구분별 색상 정의 (이미지 기준)
  const colorMap = {
    '재학생': '#3B5998',      // 진한 파란색
    '재수생': '#F5A623',      // 주황색
    '삼수이상': '#7ED321',    // 진한 초록색
    '검정고시': '#50E3C2',    // 밝은 파란색
    '기타': '#B8B8B8'
  }
  
  Object.keys(distribution).forEach(key => {
    if (distribution[key] > 0 && key !== '기타') {
      labels.push(key)
      const count = distribution[key]
      values.push(count)
      colors.push(colorMap[key] || '#B8B8B8')
    }
  })
  
  // 기타가 있으면 추가
  if (distribution['기타'] > 0) {
    labels.push('기타')
    values.push(distribution['기타'])
    colors.push('#B8B8B8')
  }
  
  console.log(`학년 구분 차트 생성 (${label}):`, { labels, values, total })
  
  // 차트 생성 전 최종 검증: DOM에 연결되어 있는지 확인
  if (!canvasRef.isConnected || !document.body.contains(canvasRef)) {
    console.warn(`차트 생성 취소 (${label}): canvas 요소가 DOM에 연결되지 않음`)
    return
  }
  
  // canvas 컨텍스트 직접 확인
  let ctx = null
  try {
    ctx = canvasRef.getContext('2d')
    if (!ctx) {
      console.warn(`차트 생성 취소 (${label}): canvas 2D 컨텍스트를 가져올 수 없음`)
      return
    }
  } catch (error) {
    console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트 오류`, error)
    return
  }
  
  try {
    // 차트 생성 전 마지막 검증: canvas가 여전히 DOM에 연결되어 있는지 확인
    if (!canvasRef || !canvasRef.isConnected || !document.body.contains(canvasRef)) {
      console.warn(`차트 생성 취소 (${label}): canvas가 DOM에서 제거됨`)
      return
    }
    
    // canvas 컨텍스트 다시 확인
    const finalCtx = canvasRef.getContext('2d')
    if (!finalCtx) {
      console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트를 가져올 수 없음`)
      return
    }
    
    gradeCharts.value[label] = new Chart(canvasRef, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // 애니메이션 비활성화로 컨텍스트 손실 방지
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            font: { size: 11 },
            generateLabels: (chart) => {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                  return {
                    text: `${label}: ${value}명 (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.parsed || 0
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              return `${label}: ${value}명 (${percentage}%)`
            }
          }
        },
      }
    },
    plugins: [{
      id: 'datalabels',
      afterDatasetsDraw: (chart) => {
        // 차트와 canvas가 유효한지 확인
        if (!chart || !chart.canvas || !chart.canvas.isConnected) {
          return
        }
        
        const ctx = chart.ctx
        if (!ctx || typeof ctx.save !== 'function') {
          console.warn(`차트 플러그인 실행 실패 (${label}): ctx가 유효하지 않음`)
          return
        }
        
        try {
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i)
            if (!meta || !meta.data) return
            
            meta.data.forEach((element, index) => {
              if (!element) return
              
              const value = dataset.data[index]
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              
              // 파이 차트 섹션의 중심점 계산
              const { x, y, startAngle, endAngle, innerRadius, outerRadius } = element
              const centerX = x
              const centerY = y
              
              // 각도의 중앙 계산
              const angle = (startAngle + endAngle) / 2
              
              // 섹션 중심에 텍스트 표시하기 위한 위치 계산
              const labelX = centerX + Math.cos(angle) * ((innerRadius + outerRadius) / 2)
              const labelY = centerY + Math.sin(angle) * ((innerRadius + outerRadius) / 2)
              
              // ctx가 여전히 유효한지 확인
              if (!ctx || typeof ctx.save !== 'function') return
              
              ctx.save()
              ctx.font = 'bold 12px sans-serif'
              ctx.fillStyle = '#fff'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
              ctx.shadowBlur = 3
              ctx.shadowOffsetX = 1
              ctx.shadowOffsetY = 1
              
              // 값 표시
              ctx.fillText(`${value}명`, labelX, labelY - 10)
              ctx.font = '11px sans-serif'
              ctx.fillText(`(${percentage}%)`, labelX, labelY + 8)
              ctx.restore()
            })
          })
        } catch (error) {
          console.warn(`차트 플러그인 에러 (${label}):`, error)
        }
      }
    }]
    })
  } catch (error) {
    console.error(`학년 구분 차트 생성 실패 (${label}):`, error)
    return
  }
}

function createReasonChart(canvasRef, data, label, chartRefs) {
  if (!canvasRef) {
    console.log(`선택 이유 차트 생성 실패 (${label}): canvasRef 없음`, canvasRef)
    return
  }
  
  // canvas 요소가 DOM에 연결되어 있는지 확인
  if (!canvasRef.ownerDocument || !canvasRef.getContext) {
    console.log(`선택 이유 차트 생성 실패 (${label}): canvas 요소가 준비되지 않음`, canvasRef)
    return
  }

  // 방어 코드: data가 없거나 분포 정보가 없으면 빈 차트로 처리
  if (!data || !data.distribution || typeof data.total !== 'number') {
    console.warn(`선택 이유 차트 데이터 이상 (${label}):`, data)
    data = { distribution: {}, total: 0 }
  }

  const { distribution, total } = data
  
  if (total === 0 || Object.keys(distribution).length === 0) {
    console.log(`선택 이유 차트 생성 실패 (${label}): 데이터 없음`, distribution)
    // 빈 차트 표시
    if (chartRefs.value[label]) {
      chartRefs.value[label].destroy()
    }
    chartRefs.value[label] = new Chart(canvasRef, {
      type: 'bar',
      data: {
        labels: ['데이터 없음'],
        datasets: [{
          data: [0],
          backgroundColor: ['#e0e0e0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
    return
  }
  
  // 기존 차트 제거 (우리 ref + Chart 전역 모두)
  if (chartRefs.value[label]) {
    chartRefs.value[label].destroy()
  }
  const existingReason = Chart.getChart(canvasRef)
  if (existingReason) existingReason.destroy()
  const labels = Object.keys(distribution)
  const values = Object.values(distribution)
  
  console.log(`선택 이유 차트 생성 (${label}):`, { labels, values, total })
  
  // 차트 생성 전 최종 검증: DOM에 연결되어 있는지 확인
  if (!canvasRef.isConnected || !document.body.contains(canvasRef)) {
    console.warn(`차트 생성 취소 (${label}): canvas 요소가 DOM에 연결되지 않음`)
    return
  }
  
  // canvas 컨텍스트 직접 확인
  let ctx = null
  try {
    ctx = canvasRef.getContext('2d')
    if (!ctx) {
      console.warn(`차트 생성 취소 (${label}): canvas 2D 컨텍스트를 가져올 수 없음`)
      return
    }
  } catch (error) {
    console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트 오류`, error)
    return
  }
  
  try {
    // 차트 생성 전 마지막 검증: canvas가 여전히 DOM에 연결되어 있는지 확인
    if (!canvasRef || !canvasRef.isConnected || !document.body.contains(canvasRef)) {
      console.warn(`차트 생성 취소 (${label}): canvas가 DOM에서 제거됨`)
      return
    }
    
    // canvas 컨텍스트 다시 확인
    const finalCtx = canvasRef.getContext('2d')
    if (!finalCtx) {
      console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트를 가져올 수 없음`)
      return
    }
    
    chartRefs.value[label] = new Chart(canvasRef, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '인원',
        data: values,
        backgroundColor: '#7ED321',
        borderColor: '#5FB01F',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // 가로 막대 그래프 (Chart.js v4)
      animation: {
        duration: 0 // 애니메이션 비활성화로 컨텍스트 손실 방지
      },
      plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.x !== undefined ? context.parsed.x : context.parsed.y || 0
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                return `인원: ${value}명 (${percentage}%)`
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              maxTicksLimit: 100,
              precision: 0
            }
          },
          y: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 10
              }
            }
          }
        }
    },
    plugins: [{
      id: 'datalabels',
      afterDatasetsDraw: (chart) => {
        // 차트와 canvas가 유효한지 확인
        if (!chart || !chart.canvas || !chart.canvas.isConnected) {
          return
        }
        
        const ctx = chart.ctx
        if (!ctx || typeof ctx.save !== 'function') {
          console.warn(`차트 플러그인 실행 실패 (${label}): ctx가 유효하지 않음`)
          return
        }
        
        try {
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i)
            if (!meta || !meta.data) return
            
            meta.data.forEach((element, index) => {
              if (!element) return
              
              const value = dataset.data[index]
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              
              // ctx가 여전히 유효한지 확인
              if (!ctx || typeof ctx.save !== 'function') return
              
              ctx.save()
              ctx.font = 'bold 11px sans-serif'
              ctx.fillStyle = '#333'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              
              // 가로 막대 내부 중앙에 텍스트 표시 (가장 긴 막대도 안 잘리도록)
              // indexAxis: 'y' 이므로 x축이 값, base는 0에 해당
              const valueX = element.x
              const baseX = element.base
              const centerX = (valueX + baseX) / 2
              const centerY = element.y
              
              ctx.fillText(`${value}명`, centerX, centerY - 5)
              ctx.font = '10px sans-serif'
              ctx.fillStyle = '#666'
              ctx.fillText(`(${percentage}%)`, centerX, centerY + 10)
              ctx.restore()
            })
          })
        } catch (error) {
          console.warn(`차트 플러그인 에러 (${label}):`, error)
        }
      }
    }]
    })
  } catch (error) {
    console.error(`선택 이유 차트 생성 실패 (${label}):`, error)
    return
  }
}

function createEnrollmentChart(canvasRef, data, label) {
  if (!canvasRef) {
    console.log(`입학시기 차트 생성 실패 (${label}): canvasRef 없음`, canvasRef)
    return
  }
  
  // canvas 요소가 DOM에 연결되어 있는지 확인
  if (!canvasRef.ownerDocument || !canvasRef.getContext) {
    console.log(`입학시기 차트 생성 실패 (${label}): canvas 요소가 준비되지 않음`, canvasRef)
    return
  }
  
  // 방어 코드: data가 없거나 분포 정보가 없으면 빈 차트로 처리
  if (!data || !data.distribution || typeof data.total !== 'number') {
    console.warn(`입학시기 차트 데이터 이상 (${label}):`, data)
    data = { distribution: {}, total: 0 }
  }
  
  const { distribution, total } = data
  
  if (total === 0 || Object.keys(distribution).length === 0) {
    console.log(`입학시기 차트 생성 실패 (${label}): 데이터 없음`, distribution)
    // 빈 차트 표시
    if (enrollmentCharts.value[label]) {
      enrollmentCharts.value[label].destroy()
    }
    enrollmentCharts.value[label] = new Chart(canvasRef, {
      type: 'bar',
      data: {
        labels: ['데이터 없음'],
        datasets: [{
          data: [0],
          backgroundColor: ['#e0e0e0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
    return
  }
  
  // 기존 차트 제거 (우리 ref + Chart 전역 모두)
  if (enrollmentCharts.value[label]) {
    enrollmentCharts.value[label].destroy()
  }
  const existingEnroll = Chart.getChart(canvasRef)
  if (existingEnroll) existingEnroll.destroy()
  
  const labels = Object.keys(distribution)
  const values = Object.values(distribution)
  
  console.log(`입학시기 차트 생성 (${label}):`, { labels, values, total })
  
  // 차트 생성 전 최종 검증: DOM에 연결되어 있는지 확인
  if (!canvasRef.isConnected || !document.body.contains(canvasRef)) {
    console.warn(`차트 생성 취소 (${label}): canvas 요소가 DOM에 연결되지 않음`)
    return
  }
  
  // canvas 컨텍스트 직접 확인
  let ctx = null
  try {
    ctx = canvasRef.getContext('2d')
    if (!ctx) {
      console.warn(`차트 생성 취소 (${label}): canvas 2D 컨텍스트를 가져올 수 없음`)
      return
    }
  } catch (error) {
    console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트 오류`, error)
    return
  }
  
  try {
    // 차트 생성 전 마지막 검증: canvas가 여전히 DOM에 연결되어 있는지 확인
    if (!canvasRef || !canvasRef.isConnected || !document.body.contains(canvasRef)) {
      console.warn(`차트 생성 취소 (${label}): canvas가 DOM에서 제거됨`)
      return
    }
    
    // canvas 컨텍스트 다시 확인
    const finalCtx = canvasRef.getContext('2d')
    if (!finalCtx) {
      console.warn(`차트 생성 취소 (${label}): canvas 컨텍스트를 가져올 수 없음`)
      return
    }
    
    enrollmentCharts.value[label] = new Chart(canvasRef, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '인원',
        data: values,
        backgroundColor: '#4A90E2',
        borderColor: '#357ABD',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // 애니메이션 비활성화로 컨텍스트 손실 방지
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y || 0
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              return `인원: ${value}명 (${percentage}%)`
            }
          }
        }
      },
      layout: {
        padding: {
          top: 30,
          right: 10,
          bottom: 10,
          left: 10
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    },
    plugins: [{
      id: 'datalabels',
      afterDatasetsDraw: (chart) => {
        // 차트와 canvas가 유효한지 확인
        if (!chart || !chart.canvas || !chart.canvas.isConnected) {
          return
        }
        
        const ctx = chart.ctx
        if (!ctx || typeof ctx.save !== 'function') {
          console.warn(`차트 플러그인 실행 실패 (${label}): ctx가 유효하지 않음`)
          return
        }
        
        try {
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i)
            if (!meta || !meta.data) return
            
            meta.data.forEach((element, index) => {
              if (!element) return
              
              const value = dataset.data[index]
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              
              // ctx가 여전히 유효한지 확인
              if (!ctx || typeof ctx.save !== 'function') return
              
              ctx.save()
              ctx.font = 'bold 11px sans-serif'
              ctx.fillStyle = '#333'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              
              // 막대 내부 중앙에 텍스트 표시 (잘리지 않도록)
              const x = element.x
              const y = (element.y + element.base) / 2
              ctx.fillText(`${value}명`, x, y - 5)
              ctx.font = '10px sans-serif'
              ctx.fillStyle = '#666'
              ctx.fillText(`(${percentage}%)`, x, y + 10)
              ctx.restore()
            })
          })
        } catch (error) {
          console.warn(`차트 플러그인 에러 (${label}):`, error)
        }
      }
    }]
    })
  } catch (error) {
    console.error(`입학시기 차트 생성 실패 (${label}):`, error)
    return
  }
}

// 차트 업데이트
function updateCharts() {
  if (processedData.value.length === 0) {
    console.log('차트 업데이트: 데이터 없음')
    return
  }
  
  // DOM이 완전히 렌더링될 때까지 대기
  nextTick(() => {
    setTimeout(() => {
      try {
      console.log('차트 업데이트 시작', {
        processedDataLength: processedData.value.length,
        gradeDataOverall: gradeData.value.overall,
        enrollmentDataOverall: enrollmentData.value.overall,
        selfstudyReasonDataOverall: selfstudyReasonData.value.overall,
        etosReasonDataOverall: etosReasonData.value.overall,
        chartRefs: {
          gradeOverall: !!gradeOverallChart.value,
          gradeRegion: !!gradeRegionChart.value,
          gradeGroup: !!gradeGroupChart.value,
          gradeLocation: !!gradeLocationChart.value,
          enrollmentOverall: !!enrollmentOverallChart.value,
          enrollmentRegion: !!enrollmentRegionChart.value,
          enrollmentGroup: !!enrollmentGroupChart.value,
          enrollmentLocation: !!enrollmentLocationChart.value,
          selfstudyOverall: !!selfstudyOverallChart.value,
          selfstudyRegion: !!selfstudyRegionChart.value,
          selfstudyGroup: !!selfstudyGroupChart.value,
          selfstudyLocation: !!selfstudyLocationChart.value,
          etosOverall: !!etosOverallChart.value,
          etosRegion: !!etosRegionChart.value,
          etosGroup: !!etosGroupChart.value,
          etosLocation: !!etosLocationChart.value
        }
      })
      
      // 학년 구분 차트
      if (gradeOverallChart.value) {
        createGradeChart(gradeOverallChart.value, gradeData.value.overall, 'overall')
      }
      if (gradeRegionChart.value) {
        createGradeChart(gradeRegionChart.value, gradeData.value.region, 'region')
      }
      if (gradeGroupChart.value) {
        createGradeChart(gradeGroupChart.value, gradeData.value.group, 'group')
      }
      if (gradeLocationChart.value) {
        createGradeChart(gradeLocationChart.value, gradeData.value.location, 'location')
      }
      
      // 입학시기 차트
      if (enrollmentOverallChart.value) {
        createEnrollmentChart(enrollmentOverallChart.value, enrollmentData.value.overall, 'overall')
      }
      if (enrollmentRegionChart.value) {
        createEnrollmentChart(enrollmentRegionChart.value, enrollmentData.value.region, 'region')
      }
      if (enrollmentGroupChart.value) {
        createEnrollmentChart(enrollmentGroupChart.value, enrollmentData.value.group, 'group')
      }
      if (enrollmentLocationChart.value) {
        createEnrollmentChart(enrollmentLocationChart.value, enrollmentData.value.location, 'location')
      }
      
      // 자기주도학습 선택 이유 차트
      if (selfstudyOverallChart.value) {
        createReasonChart(selfstudyOverallChart.value, selfstudyReasonData.value.overall, 'overall', selfstudyCharts)
      }
      if (selfstudyRegionChart.value) {
        createReasonChart(selfstudyRegionChart.value, selfstudyReasonData.value.region, 'region', selfstudyCharts)
      }
      if (selfstudyGroupChart.value) {
        createReasonChart(selfstudyGroupChart.value, selfstudyReasonData.value.group, 'group', selfstudyCharts)
      }
      if (selfstudyLocationChart.value) {
        createReasonChart(selfstudyLocationChart.value, selfstudyReasonData.value.location, 'location', selfstudyCharts)
      }
      
      // 이투스247학원 선택 이유 차트
      if (etosOverallChart.value) {
        createReasonChart(etosOverallChart.value, etosReasonData.value.overall, 'overall', etosCharts)
      }
      if (etosRegionChart.value) {
        createReasonChart(etosRegionChart.value, etosReasonData.value.region, 'region', etosCharts)
      }
      if (etosGroupChart.value) {
        createReasonChart(etosGroupChart.value, etosReasonData.value.group, 'group', etosCharts)
      }
      if (etosLocationChart.value) {
        createReasonChart(etosLocationChart.value, etosReasonData.value.location, 'location', etosCharts)
      }

      // A5~C5 분포 차트 (전체/권역/그룹/지점)
      if (a5OverallChart.value) {
        createReasonChart(a5OverallChart.value, a5Data.value.overall, 'a5Overall', miscReasonCharts)
      }
      if (a5RegionChart.value) {
        createReasonChart(a5RegionChart.value, a5Data.value.region, 'a5Region', miscReasonCharts)
      }
      if (a5GroupChart.value) {
        createReasonChart(a5GroupChart.value, a5Data.value.group, 'a5Group', miscReasonCharts)
      }
      if (a5LocationChart.value) {
        createReasonChart(a5LocationChart.value, a5Data.value.location, 'a5Location', miscReasonCharts)
      }

      if (a6OverallChart.value) {
        createReasonChart(a6OverallChart.value, a6Data.value.overall, 'a6Overall', miscReasonCharts)
      }
      if (a6RegionChart.value) {
        createReasonChart(a6RegionChart.value, a6Data.value.region, 'a6Region', miscReasonCharts)
      }
      if (a6GroupChart.value) {
        createReasonChart(a6GroupChart.value, a6Data.value.group, 'a6Group', miscReasonCharts)
      }
      if (a6LocationChart.value) {
        createReasonChart(a6LocationChart.value, a6Data.value.location, 'a6Location', miscReasonCharts)
      }

      if (a7OverallChart.value) {
        createReasonChart(a7OverallChart.value, a7Data.value.overall, 'a7Overall', miscReasonCharts)
      }
      if (a7RegionChart.value) {
        createReasonChart(a7RegionChart.value, a7Data.value.region, 'a7Region', miscReasonCharts)
      }
      if (a7GroupChart.value) {
        createReasonChart(a7GroupChart.value, a7Data.value.group, 'a7Group', miscReasonCharts)
      }
      if (a7LocationChart.value) {
        createReasonChart(a7LocationChart.value, a7Data.value.location, 'a7Location', miscReasonCharts)
      }

      if (a8OverallChart.value) {
        createReasonChart(a8OverallChart.value, a8Data.value.overall, 'a8Overall', miscReasonCharts)
      }
      if (a8RegionChart.value) {
        createReasonChart(a8RegionChart.value, a8Data.value.region, 'a8Region', miscReasonCharts)
      }
      if (a8GroupChart.value) {
        createReasonChart(a8GroupChart.value, a8Data.value.group, 'a8Group', miscReasonCharts)
      }
      if (a8LocationChart.value) {
        createReasonChart(a8LocationChart.value, a8Data.value.location, 'a8Location', miscReasonCharts)
      }

      if (b2OverallChart.value) {
        createReasonChart(b2OverallChart.value, b2Data.value.overall, 'b2Overall', miscReasonCharts)
      }
      if (b2RegionChart.value) {
        createReasonChart(b2RegionChart.value, b2Data.value.region, 'b2Region', miscReasonCharts)
      }
      if (b2GroupChart.value) {
        createReasonChart(b2GroupChart.value, b2Data.value.group, 'b2Group', miscReasonCharts)
      }
      if (b2LocationChart.value) {
        createReasonChart(b2LocationChart.value, b2Data.value.location, 'b2Location', miscReasonCharts)
      }

      if (b5OverallChart.value) {
        createReasonChart(b5OverallChart.value, b5Data.value.overall, 'b5Overall', miscReasonCharts)
      }
      if (b5RegionChart.value) {
        createReasonChart(b5RegionChart.value, b5Data.value.region, 'b5Region', miscReasonCharts)
      }
      if (b5GroupChart.value) {
        createReasonChart(b5GroupChart.value, b5Data.value.group, 'b5Group', miscReasonCharts)
      }
      if (b5LocationChart.value) {
        createReasonChart(b5LocationChart.value, b5Data.value.location, 'b5Location', miscReasonCharts)
      }

      if (b7OverallChart.value) {
        createReasonChart(b7OverallChart.value, b7Data.value.overall, 'b7Overall', miscReasonCharts)
      }
      if (b7RegionChart.value) {
        createReasonChart(b7RegionChart.value, b7Data.value.region, 'b7Region', miscReasonCharts)
      }
      if (b7GroupChart.value) {
        createReasonChart(b7GroupChart.value, b7Data.value.group, 'b7Group', miscReasonCharts)
      }
      if (b7LocationChart.value) {
        createReasonChart(b7LocationChart.value, b7Data.value.location, 'b7Location', miscReasonCharts)
      }

      if (b9OverallChart.value) {
        createReasonChart(b9OverallChart.value, b9Data.value.overall, 'b9Overall', miscReasonCharts)
      }
      if (b9RegionChart.value) {
        createReasonChart(b9RegionChart.value, b9Data.value.region, 'b9Region', miscReasonCharts)
      }
      if (b9GroupChart.value) {
        createReasonChart(b9GroupChart.value, b9Data.value.group, 'b9Group', miscReasonCharts)
      }
      if (b9LocationChart.value) {
        createReasonChart(b9LocationChart.value, b9Data.value.location, 'b9Location', miscReasonCharts)
      }

      if (b10OverallChart.value) {
        createReasonChart(b10OverallChart.value, b10Data.value.overall, 'b10Overall', miscReasonCharts)
      }
      if (b10RegionChart.value) {
        createReasonChart(b10RegionChart.value, b10Data.value.region, 'b10Region', miscReasonCharts)
      }
      if (b10GroupChart.value) {
        createReasonChart(b10GroupChart.value, b10Data.value.group, 'b10Group', miscReasonCharts)
      }
      if (b10LocationChart.value) {
        createReasonChart(b10LocationChart.value, b10Data.value.location, 'b10Location', miscReasonCharts)
      }

      if (c4OverallChart.value) {
        createReasonChart(c4OverallChart.value, c4Data.value.overall, 'c4Overall', miscReasonCharts)
      }
      if (c4RegionChart.value) {
        createReasonChart(c4RegionChart.value, c4Data.value.region, 'c4Region', miscReasonCharts)
      }
      if (c4GroupChart.value) {
        createReasonChart(c4GroupChart.value, c4Data.value.group, 'c4Group', miscReasonCharts)
      }
      if (c4LocationChart.value) {
        createReasonChart(c4LocationChart.value, c4Data.value.location, 'c4Location', miscReasonCharts)
      }

      if (c5OverallChart.value) {
        createReasonChart(c5OverallChart.value, c5Data.value.overall, 'c5Overall', miscReasonCharts)
      }
      if (c5RegionChart.value) {
        createReasonChart(c5RegionChart.value, c5Data.value.region, 'c5Region', miscReasonCharts)
      }
      if (c5GroupChart.value) {
        createReasonChart(c5GroupChart.value, c5Data.value.group, 'c5Group', miscReasonCharts)
      }
      if (c5LocationChart.value) {
        createReasonChart(c5LocationChart.value, c5Data.value.location, 'c5Location', miscReasonCharts)
      }
      } catch (error) {
        console.error('차트 생성 중 에러:', error)
        console.error('에러 상세:', error.message, error.stack)
      }
    }, 100)
    })
}

// 필터 변경 시 차트 업데이트
watch([filters, processedData], () => {
  if (processedData.value.length > 0) {
    nextTick(() => {
      setTimeout(() => {
        updateCharts()
      }, 200)
    })
  }
}, { deep: true })

// 데이터 로드
// 프린트 함수
function handlePrint() {
  window.print()
}

onMounted(async () => {
  try {
    loading.value = true
    console.log('데이터 로드 시작...')
    const result = await loadData()
    console.log('데이터 로드 성공:', {
      dataRows: result.data.length,
      metadataRows: result.metadata.length
    })
    rawData.value = result.data
    questionMetadata.value = result.metadata
    console.log('데이터 처리 완료', {
      rawDataLength: rawData.value.length,
      processedDataLength: processedData.value.length
    })
    
    // 차트 생성 (약간의 지연 후 - DOM이 준비될 때까지)
    // nextTick으로 먼저 한 번 시도하고, 실패하면 재시도
    nextTick(() => {
      setTimeout(() => {
        console.log('차트 참조 확인:', {
          gradeOverallChart: !!gradeOverallChart.value,
          enrollmentOverallChart: !!enrollmentOverallChart.value,
          selfstudyOverallChart: !!selfstudyOverallChart.value,
          etosOverallChart: !!etosOverallChart.value,
          processedDataLength: processedData.value.length
        })
        
        if (processedData.value.length === 0) {
          console.warn('차트 생성 취소: processedData가 비어있음')
          loading.value = false
          return
        }
        
        updateCharts()
        
        // 차트가 제대로 생성되지 않았을 경우 재시도
        setTimeout(() => {
          const hasAnyChart = gradeCharts.value['overall'] || 
                             enrollmentCharts.value['overall'] || 
                             selfstudyCharts.value['overall'] || 
                             etosCharts.value['overall']
          
          if (!hasAnyChart && processedData.value.length > 0) {
            console.log('차트 재시도 중...')
            updateCharts()
          }
          
          // 로딩 상태 해제
          loading.value = false
        }, 1000)
      }, 300)
    })
  } catch (error) {
    console.error('데이터 로드 실패:', error)
    console.error('에러 상세:', error.message, error.stack)
    alert(`데이터를 불러오는데 실패했습니다.\n\n에러: ${error.message}\n\n콘솔을 확인하세요. (F12 키)`)
    loading.value = false
  } finally {
    loading.value = false
  }
})
</script>

