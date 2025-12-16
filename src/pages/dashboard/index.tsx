import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Progress, Row, Space, Tag } from 'antd';
import { getDashboardLocale } from '@/locales';
import { useSystemStore } from '@/store';

const { Statistic } = StatisticCard;

function Dashboard() {
	const { locale, borderRadius } = useSystemStore();
	const t = getDashboardLocale(locale);

	return (
		<Space vertical size="large" style={{ width: '100%' }}>
			{/* 关键指标卡片 */}
			<StatisticCard.Group
				style={{
					borderRadius: `${borderRadius}px`,
					overflow: 'hidden',
				}}
			>
				<StatisticCard
					statistic={{
						title: t.stats.totalSales,
						value: 1128930,
						precision: 2,
						prefix: '¥',
						icon: (
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: `${borderRadius}px`,
									backgroundColor: 'var(--ant-color-primary-bg)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<i
									className="ri-money-dollar-circle-line"
									style={{ fontSize: 24, color: 'var(--ant-color-primary)' }}
								/>
							</div>
						),
						description: (
							<Space>
								<Tag color="success" icon={<i className="ri-arrow-up-line" />}>
									12.5%
								</Tag>
								<span style={{ color: 'var(--ant-color-text-secondary)' }}>较上周</span>
							</Space>
						),
					}}
					chart={
						<div style={{ height: 60 }}>
							<Progress
								percent={85}
								strokeColor={{
									'0%': 'var(--ant-color-primary)',
									'100%': 'var(--ant-color-primary-active)',
								}}
								showInfo={false}
							/>
						</div>
					}
					chartPlacement="bottom"
				/>
				<StatisticCard
					statistic={{
						title: t.stats.orderCount,
						value: 3024,
						icon: (
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: `${borderRadius}px`,
									backgroundColor: 'var(--ant-color-success-bg)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<i className="ri-shopping-cart-line" style={{ fontSize: 24, color: 'var(--ant-color-success)' }} />
							</div>
						),
						description: (
							<Space>
								<Tag color="success" icon={<i className="ri-arrow-up-line" />}>
									8.2%
								</Tag>
								<span style={{ color: 'var(--ant-color-text-secondary)' }}>较上周</span>
							</Space>
						),
					}}
					chart={
						<div style={{ height: 60 }}>
							<Progress
								percent={72}
								strokeColor={{
									'0%': 'var(--ant-color-success)',
									'100%': 'var(--ant-color-success-active)',
								}}
								showInfo={false}
							/>
						</div>
					}
					chartPlacement="bottom"
				/>
				<StatisticCard
					statistic={{
						title: t.stats.customerCount,
						value: 1128,
						icon: (
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: `${borderRadius}px`,
									backgroundColor: 'var(--ant-color-info-bg)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<i className="ri-team-line" style={{ fontSize: 24, color: 'var(--ant-color-info)' }} />
							</div>
						),
						description: (
							<Space>
								<Tag color="success" icon={<i className="ri-arrow-up-line" />}>
									15.3%
								</Tag>
								<span style={{ color: 'var(--ant-color-text-secondary)' }}>较上周</span>
							</Space>
						),
					}}
					chart={
						<div style={{ height: 60 }}>
							<Progress
								percent={90}
								strokeColor={{
									'0%': 'var(--ant-color-info)',
									'100%': 'var(--ant-color-info-active)',
								}}
								showInfo={false}
							/>
						</div>
					}
					chartPlacement="bottom"
				/>
				<StatisticCard
					statistic={{
						title: t.stats.productCount,
						value: 486,
						icon: (
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: `${borderRadius}px`,
									backgroundColor: 'var(--ant-color-warning-bg)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<i className="ri-apps-line" style={{ fontSize: 24, color: 'var(--ant-color-warning)' }} />
							</div>
						),
						description: (
							<Space>
								<Tag color="error" icon={<i className="ri-arrow-down-line" />}>
									2.1%
								</Tag>
								<span style={{ color: 'var(--ant-color-text-secondary)' }}>较上周</span>
							</Space>
						),
					}}
					chart={
						<div style={{ height: 60 }}>
							<Progress
								percent={45}
								strokeColor={{
									'0%': 'var(--ant-color-warning)',
									'100%': 'var(--ant-color-warning-active)',
								}}
								showInfo={false}
							/>
						</div>
					}
					chartPlacement="bottom"
				/>
			</StatisticCard.Group>

			{/* 系统状态和业务趋势 */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<ProCard
						title={
							<Space>
								<i className="ri-cpu-line" style={{ fontSize: 18, color: 'var(--ant-color-primary)' }} />
								<span>{t.systemPerformance.title}</span>
							</Space>
						}
						bordered
						headerBordered
						style={{ borderRadius: `${borderRadius}px` }}
					>
						<Space vertical size="large" style={{ width: '100%' }}>
							<div>
								<div className="mb-2 flex items-center justify-between">
									<Space>
										<i className="ri-cpu-fill" style={{ color: 'var(--ant-color-primary)' }} />
										<span>{t.systemPerformance.cpuUsage}</span>
									</Space>
									<Tag color="processing">45%</Tag>
								</div>
								<Progress
									percent={45}
									strokeColor={{
										'0%': 'var(--ant-color-primary)',
										'100%': 'var(--ant-color-primary-active)',
									}}
									strokeLinecap="round"
								/>
							</div>
							<div>
								<div className="mb-2 flex items-center justify-between">
									<Space>
										<i className="ri-database-2-fill" style={{ color: 'var(--ant-color-warning)' }} />
										<span>{t.systemPerformance.memoryUsage}</span>
									</Space>
									<Tag color="warning">62%</Tag>
								</div>
								<Progress
									percent={62}
									strokeColor={{
										'0%': 'var(--ant-color-warning)',
										'100%': 'var(--ant-color-warning-active)',
									}}
									strokeLinecap="round"
								/>
							</div>
							<div>
								<div className="mb-2 flex items-center justify-between">
									<Space>
										<i className="ri-hard-drive-2-fill" style={{ color: 'var(--ant-color-success)' }} />
										<span>{t.systemPerformance.diskSpace}</span>
									</Space>
									<Tag color="success">78%</Tag>
								</div>
								<Progress
									percent={78}
									strokeColor={{
										'0%': 'var(--ant-color-success)',
										'100%': 'var(--ant-color-success-active)',
									}}
									strokeLinecap="round"
								/>
							</div>
						</Space>
					</ProCard>
				</Col>

				<Col xs={24} lg={12}>
					<ProCard
						title={
							<Space>
								<i className="ri-line-chart-line" style={{ fontSize: 18, color: 'var(--ant-color-success)' }} />
								<span>{t.businessTrends.title}</span>
							</Space>
						}
						bordered
						headerBordered
						style={{ borderRadius: `${borderRadius}px` }}
					>
						<Space vertical size="middle" style={{ width: '100%' }}>
							<ProCard
								hoverable
								style={{
									borderRadius: `${borderRadius}px`,
									background: 'var(--ant-color-fill-quaternary)',
								}}
								bodyStyle={{ padding: '16px' }}
							>
								<Statistic
									title={
										<Space>
											<i className="ri-funds-line" style={{ color: 'var(--ant-color-success)' }} />
											<span>{t.businessTrends.salesGrowth}</span>
										</Space>
									}
									value={18.5}
									precision={1}
									styles={{ content: { color: 'var(--ant-color-success)', fontSize: 24 } }}
									prefix={<i className="ri-arrow-up-line" />}
									suffix="%"
								/>
							</ProCard>

							<ProCard
								hoverable
								style={{
									borderRadius: `${borderRadius}px`,
									background: 'var(--ant-color-fill-quaternary)',
								}}
								bodyStyle={{ padding: '16px' }}
							>
								<Statistic
									title={
										<Space>
											<i className="ri-user-add-line" style={{ color: 'var(--ant-color-info)' }} />
											<span>{t.businessTrends.newCustomerGrowth}</span>
										</Space>
									}
									value={22.3}
									precision={1}
									styles={{ content: { color: 'var(--ant-color-success)', fontSize: 24 } }}
									prefix={<i className="ri-arrow-up-line" />}
									suffix="%"
								/>
							</ProCard>

							<ProCard
								hoverable
								style={{
									borderRadius: `${borderRadius}px`,
									background: 'var(--ant-color-fill-quaternary)',
								}}
								bodyStyle={{ padding: '16px' }}
							>
								<Statistic
									title={
										<Space>
											<i className="ri-checkbox-circle-line" style={{ color: 'var(--ant-color-primary)' }} />
											<span>{t.businessTrends.orderCompletionRate}</span>
										</Space>
									}
									value={94.7}
									precision={1}
									styles={{ content: { color: 'var(--ant-color-primary)', fontSize: 24 } }}
									suffix="%"
								/>
							</ProCard>

							<ProCard
								hoverable
								style={{
									borderRadius: `${borderRadius}px`,
									background: 'var(--ant-color-fill-quaternary)',
								}}
								bodyStyle={{ padding: '16px' }}
							>
								<Statistic
									title={
										<Space>
											<i className="ri-emotion-happy-line" style={{ color: 'var(--ant-color-warning)' }} />
											<span>{t.businessTrends.customerSatisfaction}</span>
										</Space>
									}
									value={89.2}
									precision={1}
									styles={{ content: { color: 'var(--ant-color-warning)', fontSize: 24 } }}
									suffix="%"
								/>
							</ProCard>
						</Space>
					</ProCard>
				</Col>
			</Row>
		</Space>
	);
}

export default Dashboard;
