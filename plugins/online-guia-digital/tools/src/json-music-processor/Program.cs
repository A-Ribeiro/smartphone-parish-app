using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace json_music_processor
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
                string[] parts = p.Split(new char[] { '[', ']' });
                if (parts.Length != 3)
                {
                    Console.WriteLine("error in external file set for: " + p);
                    Console.ReadLine();
                }
                else
                {
                    file = parts[1].Trim();
                    txt = parts[2].Trim();
                }
            }
        }

        [DataContract(Namespace = "", Name = "page")]
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
                return (T)parts.Last<object>();
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


        [DataContract(Namespace = "", Name = "hash-file")]
        class HashFile
        {
            [DataMember]
            public string hash { get; set; }
            [DataMember]
            public string file { get; set; }
        }

        [DataContract(Namespace = "", Name = "external-music")]
        class ExternalMusic
        {
            [DataMember]
            public MyJsonDictionary<string, string> hash{get; set;}

            [DataMember]
            public List<FileMusic> musiclist { get; set; }

            public ExternalMusic ()
            {
                hash = new MyJsonDictionary<string, string>();
                musiclist = new List<FileMusic>();
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
                Console.WriteLine(" erro processando entrada: " + startPattern);
                Console.ReadLine();
                return "[[ERROR!!!]]";
            }
            return result;
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
                    foreach (string str in aux)
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
                    Console.WriteLine("    ->  " + line);
                    Console.ReadLine();
                }
            }

            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(Music));
            jsonser.WriteObject(fs, music);
            fs.Close();

            return music;
        }


        [Serializable]
        public class MyJsonDictionary<K, V> : ISerializable
        {
            Dictionary<K, V> dict = new Dictionary<K, V>();

            public Dictionary<K, V> getDict()
            {
                return dict;
            }

            public MyJsonDictionary() { }

            protected MyJsonDictionary(SerializationInfo info, StreamingContext context)
            {
                throw new NotImplementedException();
            }

            public void GetObjectData(SerializationInfo info, StreamingContext context)
            {
                foreach (K key in dict.Keys)
                {
                    info.AddValue(key.ToString(), dict[key]);
                }
            }

            public void Add(K key, V value)
            {
                dict.Add(key, value);
            }

            public V this[K index]
            {
                set { dict[index] = value; }
                get { return dict[index]; }
            }
        }

        static void Main(string[] args)
        {

            if (!File.Exists("music-template.json"))
            {
                Console.WriteLine("Arquivo nao encontrado: " + "music-template.json" );
                Console.ReadLine();
                return;
            }
                

            DataContractJsonSerializer json_hashfile = new DataContractJsonSerializer( typeof(List<HashFile>) );

            FileStream fs = new FileStream("music-template.json",FileMode.Open);
            List<HashFile> hashfile = json_hashfile.ReadObject(fs) as List<HashFile>;
            fs.Close();





            List<string> music_files_list = new List<string>();
            Dictionary<string, Music> allMusic = new Dictionary<string, Music>();

            ExternalMusic externalMusic = new ExternalMusic();

            foreach (HashFile hf in hashfile)
            {
                if (!music_files_list.Contains(hf.file))
                {
                    music_files_list.Add(hf.file);

                    if (!File.Exists(hf.file))
                    {
                        Console.WriteLine("Arquivo nao encontrado: " + hf.file);
                        Console.ReadLine();
                        return;
                    }
                    
                    Music music = processMusic(hf.file);

                    allMusic.Add(hf.file, music);

                    FileMusic fileMusic = new FileMusic();

                    //fileMusic.file = kp.Value.file;
                    int index = music_files_list.IndexOf(hf.file);
                    fileMusic.file = "external_" + index;

                    fileMusic.music = music;
                    externalMusic.musiclist.Add(fileMusic);
                }
            }

            foreach( HashFile hf in hashfile )
            {
                if (!externalMusic.hash.getDict().ContainsKey(hf.hash))
                {
                    int index = music_files_list.IndexOf(hf.file);
                    hf.file = "external_" + index;
                    externalMusic.hash.Add(hf.hash, hf.file);
                }
            }
            
            if (!Directory.Exists("output"))
                Directory.CreateDirectory("output");

            fs = new FileStream("output/external-music.json", FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(ExternalMusic));
            jsonser.WriteObject(fs, externalMusic);
            fs.Close();

            string alltext = File.ReadAllText("output/external-music.json");


            for (int i=0;i < alltext.Length - 6; i++)
            {
                string entry = alltext.Substring(i, 7);
                string hex = entry.Substring(2, 4);
                if (entry[0]=='_' &&
                    entry[1] == 'x' &&
                    hex.All("0123456789abcdefABCDEF".Contains) &&
                    entry[6] == '_' )
                {
                    char c = (char)int.Parse(hex, NumberStyles.HexNumber);
                    alltext = alltext.Replace(entry, "" + c);
                }
            }

            File.WriteAllText("output/external-music.json", alltext);
        }
    }
}
