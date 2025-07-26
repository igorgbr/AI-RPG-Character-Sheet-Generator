
import React, { forwardRef, useState, useRef, useLayoutEffect } from 'react';
import { CharacterData } from '../types';
import StatBlock from './StatBlock';
import { FileDown, ImageDown } from 'lucide-react';
import { useI18n } from '../context/i18n';

declare const html2canvas: any;
declare const jspdf: any;

interface CharacterSheetProps {
    data: CharacterData;
    nameColor: string;
}

const CharacterSheet = forwardRef<HTMLDivElement, CharacterSheetProps>(({ data, nameColor }, ref) => {
    const { t } = useI18n();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const [canTruncate, setCanTruncate] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const checkTruncation = () => {
            const element = descriptionRef.current;
            if (!element) return;

            // On initial render (and when collapsed), the element has 'line-clamp-4'.
            // This allows us to correctly check if the full content height (scrollHeight)
            // is larger than the visible container height (clientHeight).
            const isOverflowing = element.scrollHeight > element.clientHeight;
            
            // The button should appear if the text is overflowing OR if it's already expanded
            // (which implies it was overflowing before). This prevents the button from
            // disappearing when the user expands the text.
            if (isOverflowing || isHistoryExpanded) {
                setCanTruncate(true);
            } else {
                setCanTruncate(false);
            }
        };

        checkTruncation();

        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [data.description, isHistoryExpanded]);
    
    const downloadFileName = `${data.name.replace(/\s+/g, '_')}_${t('downloadFilename')}`;

    const handleDownload = async (format: 'jpg' | 'pdf') => {
        if (!ref || typeof ref === 'function' || !ref.current) return;
        setIsDownloading(true);

        const element = ref.current;
        const originalShadow = element.style.boxShadow;
        element.style.boxShadow = 'none';

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: null, 
            });
            
            element.style.boxShadow = originalShadow;

            if (format === 'jpg') {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.download = `${downloadFileName}.jpg`;
                link.click();
            } else {
                const { jsPDF } = jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${downloadFileName}.pdf`);
            }
        } catch(e) {
            console.error("Download failed:", e);
            element.style.boxShadow = originalShadow;
        } finally {
            setIsDownloading(false);
        }
    };
    
    const sheetStyle = {
        backgroundImage: `url('${data.settingImageUrl}')`,
    };

    return (
        <div className="relative">
             <style>{`
                #character-sheet-content::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(31, 41, 55, 0.88);
                    border-radius: inherit;
                    z-index: 1;
                }
                #character-sheet-content > * {
                    position: relative;
                    z-index: 2;
                }
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 4;
                    overflow: hidden;
                }
             `}</style>
             <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <button onClick={() => handleDownload('jpg')} disabled={isDownloading} className="p-2 bg-gray-700/80 hover:bg-purple-600 rounded-full text-white transition-colors disabled:opacity-50" aria-label={t('downloadAriaJPG')}>
                    <ImageDown size={20} />
                </button>
                <button onClick={() => handleDownload('pdf')} disabled={isDownloading} className="p-2 bg-gray-700/80 hover:bg-purple-600 rounded-full text-white transition-colors disabled:opacity-50" aria-label={t('downloadAriaPDF')}>
                    <FileDown size={20} />
                </button>
            </div>
            <div ref={ref} id="character-sheet-content" style={sheetStyle} className="p-6 rounded-xl shadow-2xl border border-gray-700 overflow-hidden bg-cover bg-center relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <img src={data.imageUrl} alt={`${t('portraitAlt')} ${data.name}`} className="w-full h-auto object-cover rounded-lg border-2 border-gray-600" />
                    </div>

                    <div className="md:col-span-2">
                        <h2 className={`text-4xl font-bold ${nameColor} transition-colors duration-500`}>{data.name}</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-gray-300">
                            <span><strong>{t('labelRace')}:</strong> {data.race}</span>
                            <span><strong>{t('labelSetting')}:</strong> {data.setting}</span>
                            <span className="col-span-2"><strong>{t('labelInclination')}:</strong> {data.inclination}</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">{t('weapon')}</p>
                                <p className="font-bold text-lg text-amber-300">{data.equipment.weapon.name}</p>
                                <p className="text-sm font-semibold text-red-400">{data.equipment.weapon.damage} {t('damage')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">{t('shield')}</p>
                                <p className="font-bold text-lg text-sky-300">{data.equipment.shield.name}</p>
                                <p className="text-sm font-semibold text-green-400">{data.equipment.shield.defense} {t('defense')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold border-b-2 border-purple-500 pb-1 mb-3 text-gray-200">{t('history')}</h3>
                    <p ref={descriptionRef} className={`text-gray-400 text-sm leading-relaxed whitespace-pre-wrap ${!isHistoryExpanded ? 'line-clamp-4' : ''}`}>{data.description}</p>
                    {canTruncate && (
                        <button
                            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                            className="text-purple-400 hover:text-purple-300 font-semibold text-sm mt-2"
                        >
                            {isHistoryExpanded ? t('readLess') : t('readMore')}
                        </button>
                    )}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatBlock title={t('mainSkillsTitle')} stats={data.stats.mainSkills} color="text-green-400" />
                    <StatBlock title={t('secondarySkillsTitle')} stats={data.stats.secondarySkills} color="text-yellow-400" />
                    <StatBlock title={t('extraSkillsTitle')} stats={data.stats.extraSkills} color="text-cyan-400" />
                </div>
            </div>
        </div>
    );
});

CharacterSheet.displayName = 'CharacterSheet';

export default CharacterSheet;
