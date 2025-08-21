import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  const features = [
    {
      href: '/profile',
      icon: '👶',
      title: 'プロフィール',
      description: '赤ちゃんの基本情報を登録・管理',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-100'
    },
    {
      href: '/record',
      icon: '📝',
      title: '食事記録',
      description: '毎日の離乳食を簡単記録',
      color: 'bg-green-50 text-green-600 border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      href: '/history',
      icon: '📅',
      title: '履歴',
      description: '過去の食事記録をカレンダーで確認',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      href: '/analysis',
      icon: '📊',
      title: '栄養分析',
      description: '栄養バランスをチャートで確認',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      iconBg: 'bg-orange-100'
    },
    {
      href: '/report',
      icon: '📋',
      title: '成長レポート',
      description: '詳細な成長・栄養レポート',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-red-100'
    }
  ];

  const statusItems = [
    { status: 'completed', label: 'プロフィール管理 - 赤ちゃんの基本情報登録' },
    { status: 'completed', label: '食事記録 - 毎日の離乳食を簡単記録' },
    { status: 'completed', label: '履歴表示 - カレンダー形式で過去の記録を確認' },
    { status: 'completed', label: '栄養分析 - リアルタイムでの栄養バランス確認' },
    { status: 'completed', label: '成長レポート - 詳細な栄養摂取レポート' },
    { status: 'development', label: 'MicroCMS連携 - クラウド同期 (開発中)' }
  ];

  return (
    <Container maxWidth="xl" className="space-y-8">
      {/* ヘッダーセクション */}
      <div className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <span className="text-lg md:text-xl">🍼</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          離乳食記録アプリ
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          赤ちゃんの健やかな成長をサポートする、栄養管理と記録のアプリケーション
        </p>
      </div>

      {/* 機能カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <Link key={index} href={feature.href}>
            <Card hover className={`h-full border-2 ${feature.color}`}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.iconBg} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-lg md:text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* 設定カード */}
        <Card variant="outlined" className="h-full border-2 bg-gray-50 text-gray-600 border-gray-200">
          <CardContent className="flex flex-col items-center text-center p-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-lg md:text-xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">設定</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              アプリの設定と詳細情報
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 機能ステータス */}
      <Card>
        <CardHeader>
          <CardTitle>機能一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 ${
                  item.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-gray-700 text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ウェルカムメッセージ */}
      <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="text-center p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <span className="text-xl">🎉</span>
            <span>ようこそ！</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            赤ちゃんの離乳食記録を始めましょう。まずはプロフィールを登録して、
            <br className="hidden md:block" />
            日々の食事記録を通して成長をサポートしていきましょう。
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}