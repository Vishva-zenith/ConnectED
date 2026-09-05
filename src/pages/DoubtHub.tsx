import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  HelpCircle,
  Mic,
  Image as ImageIcon,
  Send,
  Layers,
  ThumbsUp,
  Globe,
  Sparkles,
  Bot,
  MessageSquare,
  Lock,
  Plus,
} from 'lucide-react';

export const DoubtHub: React.FC = () => {
  const {
    user,
    doubts,
    clusters,
    addDoubt,
    addAnswer,
    upvoteDoubt,
    fetchClusters,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'clusters'>('all');
  const [showAskModal, setShowAskModal] = useState<boolean>(false);

  const [dbDoubts, setDbDoubts] = useState<any[]>([]);
  const [loadingDoubts, setLoadingDoubts] = useState(true);
  const [doubtError, setDoubtError] = useState('');

  // New doubt form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Embedded Systems');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [hasVoice, setHasVoice] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Answer drawer state
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [ansAnonymous, setAnsAnonymous] = useState(false);

  // ============================================================
  // FETCH DOUBTS FROM BACKEND
  // ============================================================

  const loadDoubts = async () => {
    try {
      setLoadingDoubts(true);
      setDoubtError('');

      const response = await fetch(
        'http://localhost:8000/api/doubts'
      );

      if (!response.ok) {
        throw new Error('Failed to load doubts');
      }

      const data = await response.json();

      setDbDoubts(data.doubts || []);
    } catch (error) {
      console.error('Failed to fetch doubts:', error);
      setDoubtError(
        'Unable to load doubts from the server.'
      );
    } finally {
      setLoadingDoubts(false);
    }
  };

  // Load doubts and clusters when page opens
  useEffect(() => {
    loadDoubts();

    fetchClusters().catch((error) => {
      console.error(
        'Failed to fetch AI clusters:',
        error
      );
    });

    // We intentionally run this only once when DoubtHub loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // POST NEW DOUBT
  // ============================================================

  const handlePostDoubt = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      setDoubtError('');

      /*
       * Send the doubt to the AI backend.
       *
       * Backend:
       * POST /api/ai/doubt
       */

      const response = await fetch(
        'http://localhost:8000/api/ai/doubt',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: content,
            subject: category,
            context: title,
            language: lang,
            is_anonymous: isAnonymous,
            author_id: user.id,
            author_alias: isAnonymous
              ? user.anonymousAlias
              : user.name,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => ({}));

        throw new Error(
          errorData.detail ||
            'Failed to post doubt'
        );
      }

      const aiData = await response.json();

      console.log(
        'AI doubt response:',
        aiData
      );

      /*
       * Refresh doubts from database.
       */

      await loadDoubts();

      /*
       * Refresh AI clusters.
       */

      await fetchClusters();

      /*
       * Also update AppContext state when possible.
       *
       * This keeps the local application state synchronized.
       */

      try {
        await addDoubt({
          title,
          content,
          category,
          isAnonymous,
          language: lang,
          hasVoice,
          hasImage,
          imageUrl,
          peerRouting: [],
          clusterTopic:
            aiData.cluster_topic ||
            'AI Generated Cluster',
        } as any);
      } catch (contextError) {
        console.warn(
          'Context doubt update skipped:',
          contextError
        );
      }

      // Clear form
      setTitle('');
      setContent('');
      setImageUrl('');
      setHasVoice(false);
      setHasImage(false);
      setIsAnonymous(true);

      setShowAskModal(false);

    } catch (error) {
      console.error(
        'Failed to post doubt:',
        error
      );

      setDoubtError(
        'Unable to post doubt. Please make sure the backend is running.'
      );
    }
  };

  // ============================================================
  // POST ANSWER
  // ============================================================

  const handlePostAnswer = async (
    doubtId: string
  ) => {
    if (!answerText.trim()) {
      return;
    }

    try {
      /*
       * Use AppContext's backend-connected addAnswer.
       */

      await addAnswer(
        doubtId,
        answerText,
        ansAnonymous
      );

      /*
       * Reload doubts so that answers remain synchronized
       * with the backend.
       */

      await loadDoubts();

      setAnswerText('');

      console.log(
        'Answer posted successfully'
      );

    } catch (error) {
      console.error(
        'Failed to post answer:',
        error
      );
    }
  };

  // ============================================================
  // UPVOTE
  // ============================================================

  const handleUpvote = async (
    doubtId: string
  ) => {
    try {
      await upvoteDoubt(doubtId);

      /*
       * Refresh from backend to guarantee
       * correct upvote count.
       */

      await loadDoubts();

    } catch (error) {
      console.error(
        'Failed to upvote doubt:',
        error
      );
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loadingDoubts) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="glass-panel p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Loading ConnectED Doubt Hub...
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Fetching questions and AI intelligence.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">

        <div>
          <div className="flex items-center space-x-2">

            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />

              <span>
                Anonymous Doubt Hub
              </span>
            </h1>

            <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
              AI Question Clustering + Peer Routing
            </span>

          </div>

          <p className="text-slate-600 text-xs mt-1">
            Ask technical questions without fear.
            AI groups duplicate topics and routes
            your query to peers who solved similar bugs.
          </p>
        </div>

        <div className="flex items-center space-x-2">

          <button
            onClick={() =>
              setShowAskModal(true)
            }
            className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />

            <span>
              Ask Anonymous Doubt
            </span>
          </button>

        </div>
      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {doubtError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
          {doubtError}
        </div>
      )}

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="flex items-center space-x-4 border-b border-slate-200 text-sm font-semibold">

        <button
          onClick={() =>
            setActiveTab('all')
          }
          className={`pb-3 transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />

          <span>
            Technical Doubts ({dbDoubts.length})
          </span>
        </button>

        <button
          onClick={() =>
            setActiveTab('clusters')
          }
          className={`pb-3 transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'clusters'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />

          <span>
            AI Question Clusters ({clusters.length})
          </span>
        </button>

      </div>

      {/* ======================================================
          ALL DOUBTS TAB
      ====================================================== */}

      {activeTab === 'all' && (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="lg:col-span-2 space-y-4">

            {dbDoubts.length > 0 ? (

              dbDoubts.map((d) => (

                <div
                  key={d.id}
                  className="glass-panel p-5 space-y-4 relative"
                >

                  {/* ------------------------------------------
                      TOP INFORMATION
                  ------------------------------------------ */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center space-x-2">

                      <span className="bg-slate-800 text-slate-700 border border-slate-300 text-[10px] px-2 py-0.5 rounded font-medium">
                        {d.category}
                      </span>

                      <span className="text-[11px] text-slate-600 flex items-center space-x-1">

                        <Lock className="w-3 h-3 text-blue-600" />

                        <span>
                          {d.authorAlias ||
                            d.author_alias ||
                            'Anonymous'}
                        </span>

                      </span>

                      <span className="text-[11px] text-slate-500">
                        • {d.timestamp ||
                          d.created_at ||
                          'Recently'}
                      </span>

                    </div>

                    <div className="flex items-center space-x-2 text-xs">

                      {d.hasVoice && (
                        <span className="bg-purple-100 text-purple-700 border border-purple-500/20 px-2 py-0.5 rounded flex items-center space-x-1 text-[10px]">

                          <Mic className="w-3 h-3 text-purple-600" />

                          <span>
                            Voice Input
                          </span>

                        </span>
                      )}

                      {d.hasImage && (
                        <span className="bg-indigo-100 text-indigo-700 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center space-x-1 text-[10px]">

                          <ImageIcon className="w-3 h-3 text-indigo-600" />

                          <span>
                            Image Attached
                          </span>

                        </span>
                      )}

                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                        {d.language || 'en'}
                      </span>

                    </div>

                  </div>

                  {/* ------------------------------------------
                      QUESTION
                  ------------------------------------------ */}

                  <div className="space-y-2">

                    <h3 className="text-base font-bold text-slate-900">
                      {d.title}
                    </h3>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {d.content}
                    </p>

                    {d.imageUrl && (
                      <img
                        src={d.imageUrl}
                        alt="Question Attachment"
                        className="w-full max-h-56 object-cover rounded-lg border border-slate-200 mt-2"
                      />
                    )}

                  </div>

                  {/* ------------------------------------------
                      AI CLUSTER
                  ------------------------------------------ */}

                  {d.clusterTopic && (

                    <div className="bg-slate-50/80 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-xs">

                      <div className="flex items-center space-x-2">

                        <Layers className="w-4 h-4 text-amber-600" />

                        <span className="text-slate-700 font-medium">

                          AI Clustered Topic:{' '}

                          <strong className="text-slate-900">
                            {d.clusterTopic}
                          </strong>

                        </span>

                      </div>

                    </div>

                  )}

                  {/* ------------------------------------------
                      PEER ROUTING
                  ------------------------------------------ */}

                  {d.peerRouting &&
                    d.peerRouting.length > 0 && (

                      <div className="bg-blue-50/20 border border-blue-800/40 p-3 rounded-xl space-y-2">

                        <div className="flex items-center justify-between text-xs font-bold text-blue-700">

                          <span className="flex items-center space-x-1.5">

                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />

                            <span>
                              AI Smart Peer Routing Match
                            </span>

                          </span>

                        </div>

                        <div className="space-y-1.5">

                          {d.peerRouting.map(
                            (
                              pr: any,
                              idx: number
                            ) => (

                              <div
                                key={idx}
                                className="bg-white/90 p-2 rounded-lg text-xs flex items-center justify-between"
                              >

                                <div>

                                  <span className="font-bold text-slate-800">
                                    {pr.studentName}
                                  </span>{' '}

                                  <span className="text-slate-600">
                                    ({pr.college})
                                  </span>

                                  <p className="text-[11px] text-slate-600 italic">
                                    "{pr.matchReason}"
                                  </p>

                                </div>

                                <span className="text-xs font-bold text-emerald-600 bg-emerald-400/10 px-2 py-0.5 rounded shrink-0">
                                  {pr.compatibilityScore}% Match
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                  {/* ------------------------------------------
                      ACTION BAR
                  ------------------------------------------ */}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">

                    <div className="flex items-center space-x-4">

                      <button
                        onClick={() =>
                          handleUpvote(d.id)
                        }
                        className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 transition-colors"
                      >

                        <ThumbsUp className="w-3.5 h-3.5" />

                        <span>
                          {d.upvotes || 0} Upvotes
                        </span>

                      </button>

                      <button
                        onClick={() =>
                          setSelectedDoubtId(
                            selectedDoubtId === d.id
                              ? null
                              : d.id
                          )
                        }
                        className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                      >

                        <MessageSquare className="w-3.5 h-3.5" />

                        <span>
                          {d.answers?.length || 0} Answers
                        </span>

                      </button>

                    </div>

                    <button
                      onClick={() =>
                        setSelectedDoubtId(
                          selectedDoubtId === d.id
                            ? null
                            : d.id
                        )
                      }
                      className="bg-slate-800 hover:bg-slate-700 text-blue-600 hover:text-slate-900 font-medium px-3 py-1 rounded-lg text-xs transition-colors"
                    >
                      {selectedDoubtId === d.id
                        ? 'Hide Discussion'
                        : 'Answer or View Discussion'}
                    </button>

                  </div>

                  {/* ==========================================
                      DISCUSSION
                  ========================================== */}

                  {selectedDoubtId === d.id && (

                    <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">

                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Answers & Peer Guidance (
                        {d.answers?.length || 0}
                        )
                      </h4>

                      {/* Answers */}

                      <div className="space-y-3">

                        {(d.answers || []).map(
                          (ans: any) => (

                            <div
                              key={ans.id}
                              className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                                ans.authorType === 'AI'
                                  ? 'bg-blue-50/30 border-blue-500/40 text-blue-100'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >

                              <div className="flex items-center justify-between">

                                <div className="flex items-center space-x-2">

                                  {ans.authorType === 'AI' ? (

                                    <span className="bg-blue-600 text-slate-900 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1">

                                      <Bot className="w-3 h-3" />

                                      <span>
                                        AI Instant Explanation
                                      </span>

                                    </span>

                                  ) : (

                                    <span className="font-bold text-slate-800">

                                      {ans.authorName ||
                                        ans.author_alias ||
                                        'Anonymous'}

                                      {ans.authorCollege && (
                                        <span className="text-slate-600">
                                          {' '}
                                          (
                                          {ans.authorCollege}
                                          )
                                        </span>
                                      )}

                                    </span>

                                  )}

                                </div>

                                <span className="text-[10px] text-slate-500">
                                  {ans.timestamp ||
                                    'Recently'}
                                </span>

                              </div>

                              <p className="whitespace-pre-line leading-relaxed">
                                {ans.content}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                      {/* Answer input */}

                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">

                        <textarea
                          value={answerText}
                          onChange={(e) =>
                            setAnswerText(
                              e.target.value
                            )
                          }
                          placeholder="Write a helpful technical answer or explanation..."
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none min-h-[70px]"
                        />

                        <div className="flex items-center justify-between">

                          <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">

                            <input
                              type="checkbox"
                              checked={ansAnonymous}
                              onChange={(e) =>
                                setAnsAnonymous(
                                  e.target.checked
                                )
                              }
                              className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0"
                            />

                            <span>
                              Answer Anonymously
                            </span>

                          </label>

                          <button
                            onClick={() =>
                              handlePostAnswer(
                                d.id
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1"
                          >

                            <span>
                              Post Answer
                            </span>

                            <Send className="w-3 h-3" />

                          </button>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              ))

            ) : (

              /* ==============================================
                 EMPTY STATE
              ============================================== */

              <div className="glass-panel p-10 text-center space-y-4">

                <HelpCircle className="w-12 h-12 text-blue-500/50 mx-auto" />

                <div className="space-y-1">

                  <h3 className="text-base font-bold text-slate-800">
                    No Anonymous Doubts Posted Yet
                  </h3>

                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Be the first student to ask a technical
                    question without revealing your identity!
                  </p>

                </div>

                <div className="flex justify-center space-x-3 pt-2">

                  <button
                    onClick={() =>
                      setShowAskModal(true)
                    }
                    className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Ask First Question
                  </button>

                </div>

              </div>

            )}

          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="space-y-4">

            <div className="glass-panel p-5 space-y-3">

              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">

                <Layers className="w-4 h-4 text-amber-600" />

                <span>
                  AI Question Clustering
                </span>

              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                ConnectED maps incoming questions onto a
                semantic concept space to prevent duplicate
                noise and detect learning gaps across colleges.
              </p>

              <div className="pt-2">

                <div className="text-[10px] text-slate-500">
                  Active AI Clusters
                </div>

                <div className="text-2xl font-extrabold text-blue-600">
                  {clusters.length}
                </div>

              </div>

            </div>

            <div className="glass-panel p-5 space-y-2">

              <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase">

                <Globe className="w-4 h-4" />

                <span>
                  Multilingual Support
                </span>

              </div>

              <p className="text-xs text-slate-700">
                Ask in Hindi, Tamil, Telugu, Marathi, or
                English. Questions are automatically translated
                for peers across states.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          CLUSTERS TAB
      ====================================================== */}

      {activeTab === 'clusters' && (

        <div>

          {clusters.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {clusters.map(
                (cluster) => (

                  <div
                    key={cluster.id}
                    className="glass-panel p-5 space-y-4 border-l-4 border-l-amber-500"
                  >

                    <div className="flex items-center justify-between">

                      <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-2.5 py-0.5 rounded border border-amber-200">
                        {cluster.questionCount} Questions Clustered
                      </span>

                      <span className="text-xs text-slate-600">
                        {cluster.affectedCollegesCount} Colleges Affected
                      </span>

                    </div>

                    <div>

                      <h3 className="text-base font-bold text-slate-900">
                        {cluster.topicTitle}
                      </h3>

                      <p className="text-xs text-slate-700 mt-1">
                        {cluster.description}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="glass-panel p-10 text-center space-y-3">

              <Layers className="w-12 h-12 text-amber-500/50 mx-auto" />

              <h3 className="text-base font-bold text-slate-800">
                No AI Clusters Yet
              </h3>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Once students submit related questions,
                ConnectED AI will group them into meaningful
                technical topics.
              </p>

              <button
                onClick={() =>
                  fetchClusters()
                }
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs"
              >
                Refresh AI Clusters
              </button>

            </div>

          )}

        </div>

      )}

      {/* ======================================================
          ASK DOUBT MODAL
      ====================================================== */}

      {showAskModal && (

        <div className="fixed inset-0 z-50 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white border border-slate-300 w-full max-w-xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-slate-200 pb-3">

              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">

                <HelpCircle className="w-5 h-5 text-blue-600" />

                <span>
                  Ask an Anonymous Technical Doubt
                </span>

              </h3>

              <button
                onClick={() =>
                  setShowAskModal(false)
                }
                className="text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handlePostDoubt}
              className="space-y-4 text-xs"
            >

              {/* Title */}

              <div>

                <label className="block text-slate-700 font-semibold mb-1">
                  Question Title
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Why does my circuit reset when motor PWM initiates?"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />

              </div>

              {/* Detailed question */}

              <div>

                <label className="block text-slate-700 font-semibold mb-1">
                  Detailed Explanation
                </label>

                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Describe your circuit, code snippet, or theoretical problem..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />

              </div>

              {/* Category + Language */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-slate-700 font-semibold mb-1">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >

                    <option>
                      Embedded Systems
                    </option>

                    <option>
                      Robotics & ROS
                    </option>

                    <option>
                      Artificial Intelligence
                    </option>

                    <option>
                      Computer Vision
                    </option>

                    <option>
                      Web & Cloud
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-slate-700 font-semibold mb-1">
                    Language
                  </label>

                  <select
                    value={lang}
                    onChange={(e) =>
                      setLang(
                        e.target.value as Language
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >

                    <option value="en">
                      English
                    </option>

                    <option value="hi">
                      हिन्दी (Hindi)
                    </option>

                    <option value="ta">
                      தமிழ் (Tamil)
                    </option>

                    <option value="te">
                      తెలుగు (Telugu)
                    </option>

                    <option value="mr">
                      मराठी (Marathi)
                    </option>

                  </select>

                </div>

              </div>

              {/* Anonymous */}

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">

                <label className="flex items-center space-x-2 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) =>
                      setIsAnonymous(
                        e.target.checked
                      )
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0"
                  />

                  <span className="font-semibold text-slate-800">
                    Post Anonymously
                  </span>

                </label>

                <span className="text-[10px] text-slate-600">
                  Alias: {user.anonymousAlias}
                </span>

              </div>

              {/* Voice + image options */}

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setHasVoice(
                      !hasVoice
                    )
                  }
                  className={`p-3 rounded-lg border text-xs flex items-center justify-center gap-2 ${
                    hasVoice
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >

                  <Mic className="w-4 h-4" />

                  {hasVoice
                    ? 'Voice Enabled'
                    : 'Add Voice'}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    setHasImage(
                      !hasImage
                    )
                  }
                  className={`p-3 rounded-lg border text-xs flex items-center justify-center gap-2 ${
                    hasImage
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >

                  <ImageIcon className="w-4 h-4" />

                  {hasImage
                    ? 'Image Enabled'
                    : 'Add Image'}

                </button>

              </div>

              {/* Image URL */}

              {hasImage && (

                <div>

                  <label className="block text-slate-700 font-semibold mb-1">
                    Image URL
                  </label>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) =>
                      setImageUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900"
                  />

                </div>

              )}

              {/* Buttons */}

              <div className="flex justify-end space-x-2 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowAskModal(false)
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 rounded-lg font-semibold shadow-lg shadow-blue-600/30"
                >
                  Submit Question
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};