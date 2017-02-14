using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace json_generator
{
    class Program
    {
        [DataContract(Namespace = "", Name = "title")]
        class Title
        {
            [DataMember]
            public string txt { get; set; }
        }

        [DataContract(Namespace = "", Name = "subtitle")]
        class SubTitle
        {
            [DataMember]
            public string txt { get; set; }
        }

        [DataContract(Namespace = "", Name = "highlight")]
        class Highlight
        {
            [DataMember]
            public string txt { get; set; }
        }

        [DataContract(Namespace = "", Name = "raw-paragraph")]
        class RawParagraph
        {
            [DataMember]
            public string txt { get; set; }
        }

        [DataContract(Namespace = "", Name = "paragraph")]
        class Paragraph
        {
            [DataMember]
            public string txt { get; set; }
        }
        
        [DataContract(Namespace = "", Name = "music-link")]
        class MusicLink
        {
            [DataMember]
            public string file { get; set; }
            [DataMember]
            public string txt { get; set; }
            [DataMember]
            public string hash { get; set; }

            public void parse(string p)
            {
                string[] parts = p.Split(new char[] {'[',']'});
                if (parts.Length != 3)
                {
                    Console.WriteLine("error in external file set for: " + p);
                    Console.ReadLine();
                } else
                {
                    file = parts[1].Trim();
                    txt = parts[2].Trim();
                }
            }
        }

        [DataContract(Namespace ="", Name ="page")]
        [KnownType(typeof(Highlight))]
        [KnownType(typeof(Title))]
        [KnownType(typeof(SubTitle))]
        [KnownType(typeof(RawParagraph))]
        [KnownType(typeof(Paragraph))]
        [KnownType(typeof(MusicLink))]
        class Page
        {
            [DataMember]
            public int index { get; set; }

            [DataMember]
            public string title { get; set; }
            [DataMember]
            public string subtitle { get; set; }
            [DataMember]
            public List<object> parts { get; set; }

            public Page()
            {
                parts = new List<object>();
            }

            public T Add<T>() where T : new()
            {
                parts.Add(new T());
                return (T) parts.Last<object>();
            }            
        }



        [DataContract(Namespace = "", Name = "chorus")]
        class Chorus
        {
            [DataMember]
            public string txt { get; set; }
        }
        [DataContract(Namespace = "", Name = "verse")]
        class Verse
        {
            [DataMember]
            public string txt { get; set; }
        }

        [DataContract(Namespace = "", Name = "music")]
        [KnownType(typeof(Chorus))]
        [KnownType(typeof(Verse))]
        class Music
        {
            [DataMember]
            public string title { get; set; }
            [DataMember]
            public string author { get; set; }

            //entrada,perdão,glória,aclamação,salmo,ofertório,santo,consagração,comunhão,final
            [DataMember]
            public List<string> celebrationCategory { get; set; }

            //advento,natal,comum,quaresma,semana-santa,páscoa
            [DataMember]
            public List<string> liturgyCategory { get; set; }

            [DataMember]
            public List<object> parts { get; set; }

            [DataMember]
            public string chordsUrl { get; set; }
            [DataMember]
            public string scoreUrl { get; set; }
            [DataMember]
            public string audioUrl { get; set; }
            [DataMember]
            public string videoUrl { get; set; }

            public Music()
            {
                celebrationCategory = new List<string>();
                liturgyCategory = new List<string>();
                parts = new List<object>();
            }

            public T Add<T>() where T : new()
            {
                parts.Add(new T());
                return (T)parts.Last<object>();
            }
        }


        [DataContract(Namespace = "", Name = "file-music")]
        class FileMusic
        {
            [DataMember]
            public string file;
            [DataMember]
            public Music music;
        }


        [DataContract(Namespace = "", Name = "pages")]
        class AllPagesJson
        {
            [DataMember]
            public List<Page> pages { get; set; }
            [DataMember]
            public List<FileMusic> musiclist { get; set; }

            public AllPagesJson()
            {
                pages = new List<Page>();
                musiclist = new List<FileMusic>();
            }

            public void sortPages()
            {
                pages.Sort(delegate (Page a, Page b) {
                    return a.index.CompareTo(b.index);
                });
            }
        }
        

        static string processContent(string startPattern, string endPattern, string[] lines, ref int index)
        {
            string line = lines[index];
            if (!line.StartsWith(startPattern))
            {
                Console.WriteLine(" erro processando entrada: " + startPattern);
                Console.ReadLine();
                return "[[ERROR!!!]]";
            }
            line = line.Substring(startPattern.Length);
            string result = "";
            while (!line.EndsWith(endPattern) && index < lines.Length)
            {
                if (result.Length > 0)
                    result += "\\n";
                result += line;
                index++;
                line = lines[index];
            }
            if (result.Length > 0)
                result += "\\n";
            result += line;
            if (result.EndsWith(endPattern))
                result = result.Substring(0, result.Length - endPattern.Length);
            else
            {
                Console.WriteLine(" erro processando entrada: "+startPattern);
                Console.ReadLine();
                return "[[ERROR!!!]]";
            }
            return result;
        }

        static Page processPage(string fileinput)
        {
            Page page = new Page();

            string directory = Path.GetDirectoryName(fileinput);
            string file = Path.GetFileName(fileinput);
            string outputfile = directory + "/" + Path.GetFileNameWithoutExtension(fileinput) + ".json";

            Console.WriteLine(file + " to " + Path.GetFileNameWithoutExtension(fileinput) + ".json");

            string[] lines = File.ReadAllLines(fileinput);

            //fix all blank spaces....
            for (int index = 0; index < lines.Length; index++)
            {
                lines[index] = lines[index].Trim();
            }

            for (int index = 0; index < lines.Length; index++)
            {
                string line = lines[index];

                if (line.StartsWith("//"))
                    continue;
                else if (line.StartsWith("{pagina-indice:"))
                    page.index = int.Parse(processContent("{pagina-indice:", "}", lines, ref index).Trim());
                else if (line.StartsWith("{pagina-titulo:"))
                    page.title = processContent("{pagina-titulo:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{pagina-subtitulo:"))
                    page.subtitle = processContent("{pagina-subtitulo:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{destaque:"))
                    page.Add<Highlight>().txt = processContent("{destaque:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{titulo:"))
                    page.Add<Title>().txt = processContent("{titulo:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{subtitulo:"))
                    page.Add<SubTitle>().txt = processContent("{subtitulo:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{file:"))
                {
                    MusicLink ml = page.Add<MusicLink>();
                    ml.parse(processContent("{file:", "}", lines, ref index));
                    ml.hash = ml.txt + ":" + page.index.ToString();

                    if (MusicDictionary.ContainsKey(ml.hash))
                    {
                        Console.WriteLine("Error. Music with same name hash : " + ml.txt + " already inserted...");
                        Console.ReadLine();
                    }
                    else
                        MusicDictionary.Add(ml.hash, ml);

                }
                else if (line.StartsWith("<p"))
                    page.Add<RawParagraph>().txt = processContent("", "</p>", lines, ref index) + "</p>";
                else if (line.Length > 0)
                    page.Add<Paragraph>().txt = line;
            }

            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(Page));
            jsonser.WriteObject(fs, page);
            fs.Close();

            return page;
        }

        static Music processMusic(string fileinput)
        {

            Music music = new Music();

            string directory = Path.GetDirectoryName(fileinput);
            string file = Path.GetFileName(fileinput);
            string outputfile = directory + "/" + Path.GetFileNameWithoutExtension(fileinput) + ".json";

            Console.WriteLine(file + " to " + Path.GetFileNameWithoutExtension(fileinput) + ".json");

            string[] lines = File.ReadAllLines(fileinput);

            //fix all blank spaces....
            for (int index = 0; index < lines.Length; index++)
            {
                lines[index] = lines[index].Trim();
            }

            for (int index = 0; index < lines.Length; index++)
            {
                string line = lines[index];

                if (line.StartsWith("//"))
                    continue;

                if (line.StartsWith("{musica-titulo:"))
                    music.title = processContent("{musica-titulo:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{musica-autor:"))
                    music.author = processContent("{musica-autor:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{refrão:"))
                    music.Add<Chorus>().txt = processContent("{refrão:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{verso:"))
                    music.Add<Verse>().txt = processContent("{verso:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{musica-categoria:"))
                {
                    string[] aux = processContent("{musica-categoria:", "}", lines, ref index).Split(new char[] { ',' });
                    List<string> aux2 = new List<string>();
                    foreach(string str in aux)
                    {
                        string s = str.Trim();
                        if (s.Length > 0)
                            aux2.Add(s);
                    }
                    music.celebrationCategory = aux2;
                }
                else if (line.StartsWith("{musica-tempo-liturgico:"))
                {
                    string[] aux = processContent("{musica-tempo-liturgico:", "}", lines, ref index).Split(new char[] { ',' });
                    List<string> aux2 = new List<string>();
                    foreach (string str in aux)
                    {
                        string s = str.Trim();
                        if (s.Length > 0)
                            aux2.Add(s);
                    }
                    music.liturgyCategory = aux2;
                }
                else if (line.StartsWith("{musica-link-cifra:"))
                    music.chordsUrl = processContent("{musica-link-cifra:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{musica-link-partitura:"))
                    music.scoreUrl = processContent("{musica-link-partitura:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{musica-link-audio:"))
                    music.audioUrl = processContent("{musica-link-audio:", "}", lines, ref index).Trim();
                else if (line.StartsWith("{musica-link-video:"))
                    music.videoUrl = processContent("{musica-link-video:", "}", lines, ref index).Trim();
                else if (line.Length > 0)
                {
                    Console.WriteLine("Erro! Formato invalido no arquivo: " + fileinput);
                    Console.WriteLine("    ->  "+line);
                    Console.ReadLine();
                }
            }

            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(Music));
            jsonser.WriteObject(fs, music);
            fs.Close();

            return music;
        }

        static Dictionary<string, MusicLink> MusicDictionary = new Dictionary<string, MusicLink>();
        
        static void Main(string[] args)
        {
            AllPagesJson allPagesJson = new AllPagesJson();
            
            for (int i = 0; i < args.Length; i++)
            {
                Page page = processPage(args[i]);
                allPagesJson.pages.Add(page);
            }

            if (args.Length > 0)
            {
                Directory.SetCurrentDirectory(Path.GetDirectoryName(args[0]));

                allPagesJson.sortPages();

                //generate custom music choose template
                string music_template = "[\n";
                foreach (KeyValuePair<string, MusicLink> kp in MusicDictionary)
                    music_template += "\t{\n\t\t\"hash\":\"" + kp.Key + "\",\n\t\t\"file\":\"" + kp.Value.file + "\"\n\t},\n";
                music_template = music_template.Substring(0, music_template.Length - 2) + "\n]\n";

                File.WriteAllText(Path.GetDirectoryName(args[0]) + "/music-template.json", music_template);


                //generate music list
                List<string> music_files_list = new List<string>();
                Dictionary<string, Music> allMusic = new Dictionary<string, Music>();

                
                foreach (KeyValuePair<string, MusicLink> kp in MusicDictionary) {
                    if (!music_files_list.Contains(kp.Value.file))
                    {
                        music_files_list.Add(kp.Value.file);

                        Music music = processMusic(kp.Value.file);

                        allMusic.Add(kp.Value.file, music);

                        FileMusic fileMusic = new FileMusic();

                        //fileMusic.file = kp.Value.file;
                        int index = music_files_list.IndexOf(kp.Value.file);
                        fileMusic.file = "internal_" + index;

                        fileMusic.music = music;
                        allPagesJson.musiclist.Add(fileMusic);
                    }
                }

                foreach (KeyValuePair<string, MusicLink> kp in MusicDictionary)
                {
                    int index = music_files_list.IndexOf(kp.Value.file);
                    kp.Value.file = "internal_" + index;
                }
                


                FileStream fs = new FileStream(Path.GetDirectoryName(args[0]) + "/allpages.json", FileMode.Create);
                DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(AllPagesJson));
                jsonser.WriteObject(fs, allPagesJson);
                fs.Close();

                

            }

            Console.WriteLine("FIM...");
            //Console.ReadLine();

        }
    }
}
